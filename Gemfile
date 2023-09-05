source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.0.6'

gem 'rails', '~> 7.0.4'

# Sprockets is now an optional dependency of Rails
# TODO: Check if Sprockets can be removed
gem 'sprockets-rails', '~> 3.4.2'

# Use postgresql as the database for Active Record
gem 'pg', '~> 1.1'

# Use Puma as the app server
gem 'puma', '~> 5.0'

# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'

# Transpile app-like JavaScript
gem 'vite_rails', '~> 3.0'

# Use Redis for ActionCable and for caching
gem 'redis', '~> 4.0'
gem 'connection_pool', '~> 2.3'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.4', require: false

gem 'rexml', '~> 3.2'

# Auth0
gem 'omniauth-auth0', '~> 3.0'
gem 'omniauth-rails_csrf_protection', '~> 1.0'

# Use S3 for file storage
gem 'aws-sdk-s3', '~> 1'

# Only permit requests that originate from an authorised reverse proxy
gem 'rack_authorised_proxy'

# Use Typesense for search
gem 'typesense', '~> 0.14.1'

# Use Clockwork for recurring events
gem 'clockwork', '~> 2.0'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]

  gem 'pry'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 4.1.0'

  gem 'listen', '~> 3.3'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 3.26'
  gem 'selenium-webdriver'

  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'

  gem 'factory_bot_rails', '~> 6.2'

  gem 'minitest-stub_any_instance'
  gem 'minitest-stub-const'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
