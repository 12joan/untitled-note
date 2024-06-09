class RemoveDeeperDarkModeFromSettings < ActiveRecord::Migration[7.0]
  def change
    remove_column :settings, :deeper_dark_mode, :boolean, null: false, default: false
  end
end
