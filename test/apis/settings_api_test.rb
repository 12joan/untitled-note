require 'test_helper'

class SettingsAPITest < APITestCase
  setup do
    @user_without_settings = create(:user)
    assert_nil @user_without_settings.settings

    @user_with_settings = create(:user, settings: build(:settings, editor_style: 'literary'))
    refute_nil @user_with_settings.settings
  end

  test 'returns default values when settings does not exist' do
    result = SettingsAPI.new(user: @user_without_settings, params: {}).show
    assert_equal({}, result[:keyboard_shortcut_overrides])
    assert_equal(false, result[:deeper_dark_mode])
    assert_equal('casual', result[:editor_style])
    assert_equal('viewed', result[:recents_type])
  end

  test 'returns settings when settings exists' do
    result = SettingsAPI.new(user: @user_with_settings, params: {}).show
    assert_equal({}, result[:keyboard_shortcut_overrides])
    assert_equal(false, result[:deeper_dark_mode])
    assert_equal('literary', result[:editor_style])
  end
end
