class Settings < ApplicationRecord
  belongs_to :user

  include EditorStylable
  include Queryable.permit(*%i[keyboard_shortcut_overrides deeper_dark_mode editor_style])
  include Listenable
end
