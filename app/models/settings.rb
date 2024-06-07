class Settings < ApplicationRecord
  include EditorStylable
  include AutoSnapshotsOptionable
  include Listenable

  include Queryable.permit(
    *%i[
      keyboard_shortcut_overrides
      editor_style
      auto_snapshots_option
      recents_type
    ]
  )

  belongs_to :user

  enum recents_type: {
    viewed: 0,
    modified: 1,
  }
end
