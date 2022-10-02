ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/autorun'
require_relative 'api_test_case'

class ActiveSupport::TestCase
  ## Parallelization breaks Elasticsearch tests
  # parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  include FactoryBot::Syntax::Methods

  def as_user(user)
    post stub_login_url, params: { user_id: user.id }
  end
end
