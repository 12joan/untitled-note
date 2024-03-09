require 'test_helper'

class SettingsAPITest < APITestCase
  setup do
    @user_without_settings = create(:user)
    assert_nil @user_without_settings.settings

    @user_with_settings = create(:user, settings: build(:settings, editor_style: 'literary'))
    refute_nil @user_with_settings.settings
  end

  test 'returns default values when settings does not exist' do
    actual = SettingsAPI.new(user: @user_without_settings, params: {}).show
    expected = {
      keyboard_shortcut_overrides: {},
      deeper_dark_mode: false,
      editor_style: 'casual',
    }
    assert_equal expected, actual
  end

  test 'returns settings when settings exists' do
    actual = SettingsAPI.new(user: @user_with_settings, params: {}).show
    expected = {
      keyboard_shortcut_overrides: {},
      deeper_dark_mode: false,
      editor_style: 'literary',
    }
    assert_equal expected, actual
  end
end
