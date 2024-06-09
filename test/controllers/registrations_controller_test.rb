require 'test_helper'

class RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test 'new form is accessible when sign up is enabled' do
    with_sign_up_enabled(true) do
      get new_user_registration_url
      assert_response :success
    end
  end

  test 'new form is disabled when sign up is disabled' do
    with_sign_up_enabled(false) do
      get new_user_registration_url
      assert_redirected_to '/'
    end
  end

  test 'account creation succeeds when sign up is enabled' do
    with_sign_up_enabled(true) do
      assert_difference 'User.count' do
        try_sign_up
      end

      assert_redirected_to '/'
    end
  end

  test 'account creation fails when sign up is disabled' do
    with_sign_up_enabled(false) do
      assert_no_difference 'User.count' do
        assert_raise do
          try_sign_up
        end
      end
    end
  end

  private

  def try_sign_up
    post user_registration_url, params: {
      user: {
        email: "#{rand}@preview.local",
        password: 'password',
        password_confirmation: 'password',
      },
    }
  end
end
