require_relative 'boot'

require 'rails'

require 'active_model/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_view/railtie'
require 'action_cable/engine'
require 'action_mailer/railtie'
require 'rails/test_unit/railtie'
require 'sprockets/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Note
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    config.middleware.insert_before 0, Rack::AuthorisedProxy

    # Change the format of the cache entry.
    config.active_support.cache_format_version = 7.0

    # Rails transparently deserializes existing (Marshal-serialized) cookies on
    # read and re-writes them in the JSON format.
    config.action_dispatch.cookies_serializer = :hybrid

    config.demo_instance = ENV.fetch('DEMO_INSTANCE', 'false') == 'true'
    config.sign_up_enabled = ENV.fetch('SIGN_UP_ENABLED', 'true') == 'true'

    config.after_initialize do
      ActionMailer::Base.add_delivery_method :application, ApplicationDeliveryMethod

      ActionMailer::Base.delivery_method = :application

      ActionMailer::Base.application_settings = {
        address: ENV.fetch('SMTP_ADDRESS', nil),
        port: ENV.fetch('SMTP_PORT', '25').to_i,
        domain: ENV.fetch('SMTP_DOMAIN', nil),
        user_name: ENV.fetch('SMTP_USERNAME', nil),
        password: ENV.fetch('SMTP_PASSWORD', nil),
        authentication: ENV.fetch('SMTP_AUTHENTICATION', nil),
        enable_starttls_auto: ENV.fetch('SMTP_ENABLE_STARTTLS_AUTO', 'true') == 'true',
        openssl_verify_mode: ENV.fetch('SMTP_OPENSSL_VERIFY_MODE', nil),
        ssl: ENV.fetch('SMTP_SSL', 'false') == 'true',
      }
    end
  end
end

