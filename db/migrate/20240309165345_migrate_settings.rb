class MigrateSettings < ActiveRecord::Migration[7.0]
  def up
    add_column :settings, :keyboard_shortcut_overrides, :jsonb, null: false, default: {}
    add_column :settings, :deeper_dark_mode, :boolean, null: false, default: false
    add_column :settings, :editor_style, :integer, null: false, default: 0
    rename_column :settings, :data, :legacy_data

    Settings.find_each do |settings|
      SettingsMigration.perform(settings, settings.legacy_data)
    end
  end

  def down
    remove_column :settings, :keyboard_shortcut_overrides
    remove_column :settings, :deeper_dark_mode
    remove_column :settings, :editor_style
    rename_column :settings, :legacy_data, :data
  end
end
