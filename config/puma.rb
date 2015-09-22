workers Integer(ENV['WEB_CONCURRENCY'] || 2)
threads_count = Integer(ENV['MAX_THREADS'] || 2)
threads threads_count, threads_count

preload_app!

port    ENV['PORT'] || 3000
environment ENV['RACK_ENV'] || 'development'

ssl_bind 'localhost.ssl', '3000', { key: '/Users/marcusmc/src/dropbox_analysis/server.key', cert: '/Users/marcusmc/src/dropbox_analysis/server.crt' }

on_worker_boot do
  ActiveRecord::Base.establish_connection
end
