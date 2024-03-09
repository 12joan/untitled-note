class Settings < ApplicationRecord
  belongs_to :user

  include EditorStylable
  include AutoSnapshotsOptionable

  include Queryable.permit(
    *%i[
      keyboard_shortcut_overrides
      deeper_dark_mode
      editor_style
      auto_snapshots_option
    ]
  )

  include Listenable
end
