class CreateDropboxFileTable < ActiveRecord::Migration
  def change
    create_table :dropbox_files do |t|
      t.string :path
      t.string :case_preserved_path
      t.string :icon
      t.integer :size_in_bytes
      t.boolean :is_directory
      t.jsonb :payloads
      t.references :user
      t.timestamps
    end
  end
end
