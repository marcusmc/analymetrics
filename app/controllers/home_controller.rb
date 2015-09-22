require 'dropbox_sdk'


class HomeController < ApplicationController
  before_filter :instantiate_client

  def app
    authenticate_user!
    @account_info = @client.account_info
    #update_dropbox_state
  end

  def get_sizes_by_mime_types
    @sizes_by_mime_types = DropboxFile.where({ user_id: current_user.id }).group("payloads -> 'mime_type'").sum('size_in_bytes').reject{ |key| key.nil? }.sort_by{ |type, size| size }.reverse
    render :json => @sizes_by_mime_types.to_json
  end

  def get_largest_files
    @largest_files = DropboxFile.where({ user_id: current_user.id }).order('size_in_bytes DESC').limit(10)
    render :json => @largest_files.to_json
  end

  def get_smallest_files
    @smallest_files = DropboxFile.where({ user_id: current_user.id }).order('size_in_bytes ASC').limit(10)
    render :json => {:smallest_files_list => @smallest_files.to_json }
  end

  protected

  def apply_metadata_to_dropbox_file_record(path, metadata, file_record)
    file_record.path = path
    file_record.case_preserved_path = metadata['path']
    file_record.icon = metadata['icon']
    file_record.size_in_bytes = metadata['bytes']
    file_record.is_directory = metadata['is_dir']
    file_record.payloads = metadata.to_json
    file_record.user = current_user
    file_record.save
  end

  def instantiate_client
    authenticate_user!
    @client = DropboxClient.new(current_user.dropbox_token)
  end

  def update_dropbox_state
    current_cursor = current_user.dropbox_cursor || nil
    loop do
      new_entry_info = @client.delta(current_cursor)
      current_cursor = new_entry_info['cursor']
      #Clear local state if reset is true
      if new_entry_info['reset']
        DropboxFile.where({user_id: current_user.id}).delete_all
      end
      #Update based on entries
        new_entry_info['entries'].each do |delta_entry|
          path, metadata = delta_entry
          #First check to see if metadata is present
          local_state = DropboxFile.where({ path: path, user_id: current_user.id }).first
          if metadata != nil
            #If yes
            #TODO: Process parent folder check
            unless metadata['is_dir']
              if local_state
                #Replace local state
                apply_metadata_to_dropbox_file_record(path, metadata, local_state)
              else
                file_record = DropboxFile.new
                apply_metadata_to_dropbox_file_record(path, metadata, file_record)
              end
            else
            #If folder
              #If local state is file, replace it
              #If local state is folder, apply metadata, don't change children
              if local_state
                unless local_state.is_directory
                  apply_metadata_to_dropbox_file_record(path, metadata, local_state)
                end
              else
                #If non-existent, create as folder
                folder_record = DropboxFile.new
                apply_metadata_to_dropbox_file_record(path, metadata, folder_record)
              end
              if metadata['read_only']
                #If new entry is read-only field set to true, apply
                #read-only recursively to all files in folder
              end
            end
          else
          #If null
            if local_state
              base_path = local_state.path
              local_state.delete
              DropboxFile.where({ user_id: current_user.id }).where('path LIKE :prefix', prefix: "%#{base_path}%").delete_all
            end
            #Delete at path and all children
            #If nothing at path, ignore
          end
        end
        break unless new_entry_info['has_more']
        current_user.update_attribute('dropbox_cursor', current_cursor)
    end
  end

end
