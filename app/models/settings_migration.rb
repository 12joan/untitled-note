module SettingsMigration
  def self.perform(settings, legacy_data)
    if legacy_data.present?
      data = JSON.parse(legacy_data)

      unless data['keyboardShortcutOverrides'].nil?
        settings.keyboard_shortcut_overrides = data['keyboardShortcutOverrides']
      end

      unless data['editorStyle'].nil?
        settings.editor_style = data['editorStyle']
      end

      settings.save!
    end
  end
end
