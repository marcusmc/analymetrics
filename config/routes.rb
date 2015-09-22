Rails.application.routes.draw do
  resources :users
  root to: 'visitors#index'
  get '/auth/:provider/callback' => 'sessions#create'
  get '/signin' => 'sessions#new', :as => :signin
  get '/signout' => 'sessions#destroy', :as => :signout
  get '/auth/failure' => 'sessions#failure'
  get '/app' => 'home#app'
  get '/app/by_mime_type' => 'home#get_sizes_by_mime_types'
  get '/app/get_largest_files' => 'home#get_largest_files'
  get '/app/get_smallest_files' => 'home#get_smallest_files'
end
