require 'test_helper'

class SettingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_without_settings = create(:user)
    assert_nil @user_without_settings.settings

    @user_with_settings = create(:user, settings: build(:settings, deeper_dark_mode: true))
    refute_nil @user_with_settings.settings
  end

  test 'update should create settings when they do not exist' do
    as_user(@user_without_settings)

    assert_difference('Settings.count', 1) do
      patch api_v1_settings_url, params: {
        settings: {
          keyboard_shortcut_overrides: { 'a' => 'b' },
        },
      }
    end

    assert_response :success

    @user_without_settings.reload
    assert_equal({ 'a' => 'b' }, @user_without_settings.settings.keyboard_shortcut_overrides)
    assert_equal 'casual', @user_without_settings.settings.editor_style
    assert_equal false, @user_without_settings.settings.deeper_dark_mode
  end

  test 'update should update settings when they exist' do
    as_user(@user_with_settings)

    assert_no_difference('Settings.count') do
      patch api_v1_settings_url, params: {
        settings: {
          editor_style: 'literary',
        },
      }
    end

    assert_response :success

    @user_with_settings.reload
    assert_equal({}, @user_with_settings.settings.keyboard_shortcut_overrides)
    assert_equal 'literary', @user_with_settings.settings.editor_style
    assert_equal true, @user_with_settings.settings.deeper_dark_mode
  end
end
