require 'test_helper'

class WelcomeControllerTest < ActionDispatch::IntegrationTest
  test 'should get welcome page' do
    get welcome_url
    assert_response :success
  end
end
