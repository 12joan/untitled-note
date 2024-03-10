class Settings < ApplicationRecord
  include EditorStylable
  include AutoSnapshotsOptionable
  include Listenable

  include Queryable.permit(
    *%i[
      keyboard_shortcut_overrides
      deeper_dark_mode
      editor_style
      auto_snapshots_option
    ]
  )

  belongs_to :user
end
