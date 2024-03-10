require 'test_helper'

SettingsDouble = Struct.new(
  :keyboard_shortcut_overrides,
  :deeper_dark_mode,
  :editor_style,
  :legacy_data
) do
  def save!
    @saved = true
  end

  def saved?
    @saved
  end
end

class SettingsMigrationTest < ActiveSupport::TestCase
  setup do
    @settings = SettingsDouble.new

    @v1_data = {
      keyboardShortcutOverrides: {
        a: 'b'
      },
    }

    @v2_data = @v1_data.merge(
      deeperDarkMode: true,
    )

    @v3_data = @v2_data.merge(
      editorStyle: 'literary',
    )
  end

  test 'migrates settings without data' do
    SettingsMigration.perform(@settings, nil)
    assert_nil @settings.keyboard_shortcut_overrides
    assert_nil @settings.deeper_dark_mode
    assert_nil @settings.editor_style
    refute_predicate @settings, :saved?
  end

  test 'migrates settings with v1 data' do
    SettingsMigration.perform(@settings, @v1_data.to_json)
    assert_equal({ 'a' => 'b' }, @settings.keyboard_shortcut_overrides)
    assert_nil @settings.deeper_dark_mode
    assert_nil @settings.editor_style
    assert_predicate @settings, :saved?
  end

  test 'migrates settings with v2 data' do
    SettingsMigration.perform(@settings, @v2_data.to_json)
    assert_equal({ 'a' => 'b' }, @settings.keyboard_shortcut_overrides)
    assert_equal true, @settings.deeper_dark_mode
    assert_nil @settings.editor_style
    assert_predicate @settings, :saved?
  end

  test 'migrates settings with v3 data' do
    SettingsMigration.perform(@settings, @v3_data.to_json)
    assert_equal({ 'a' => 'b' }, @settings.keyboard_shortcut_overrides)
    assert_equal true, @settings.deeper_dark_mode
    assert_equal 'literary', @settings.editor_style
    assert_predicate @settings, :saved?
  end
end
