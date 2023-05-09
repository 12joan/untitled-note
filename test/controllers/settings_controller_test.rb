require 'test_helper'

class SettingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_without_settings = create(:user)
    assert_nil @user_without_settings.settings

    @user_with_settings = create(:user, settings: build(:settings))
    refute_nil @user_with_settings.settings
  end

  test 'should return null when settings do not exist' do
    as_user(@user_without_settings)
    get api_v1_settings_url
    assert_response :success
    assert_equal 'null', response.body
  end

  test 'should return settings when they exist' do
    as_user(@user_with_settings)
    get api_v1_settings_url
    assert_response :success
    assert_equal @user_with_settings.settings.data, response.body
  end

  test 'update should create settings when they do not exist' do
    as_user(@user_without_settings)

    assert_difference('Settings.count', 1) do
      patch api_v1_settings_url, params: {
        settings: {
          data: {
            a: 'b',
            c: {
              d: 'e',
            },
          }.to_json,
        },
      }
    end

    assert_response :success

    @user_without_settings.reload
    assert_equal '{"a":"b","c":{"d":"e"}}', @user_without_settings.settings.data
  end

  test 'update should update settings when they exist' do
    as_user(@user_with_settings)

    assert_no_difference('Settings.count') do
      patch api_v1_settings_url, params: {
        settings: {
          data: {
            a: 'b',
          }.to_json,
        },
      }
    end

    assert_response :success

    @user_with_settings.reload
    assert_equal '{"a":"b"}', @user_with_settings.settings.data
  end
end
