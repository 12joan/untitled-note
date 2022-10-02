require 'test_helper'

class AppControllerTest < ActionDispatch::IntegrationTest
  test 'should get app page when logged in' do
    as_user create(:user)
    get app_url
    assert_response :success
  end

  test 'should redirect to welcome page when not logged in' do
    get app_url
    assert_redirected_to welcome_url
  end
end
