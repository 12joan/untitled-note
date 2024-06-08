export ASSETS_PRECOMPILE=true
export RAILS_ENV=production
export SECRET_KEY_BASE=$(rails secret)
rails assets:precompile
