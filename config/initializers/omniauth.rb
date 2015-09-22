Rails.application.config.middleware.use OmniAuth::Builder do
  provider :dropbox_oauth2, Rails.application.secrets.dropbox_key, Rails.application.secrets.dropbox_secret
end
