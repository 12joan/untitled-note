class AddRecentsTypeToSettings < ActiveRecord::Migration[7.0]
  def change
    # Enum defined in /app/models/settings.rb
    add_column :settings, :recents_type, :integer, default: 0, null: false
  end
end
