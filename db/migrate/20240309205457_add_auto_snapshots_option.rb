class AddAutoSnapshotsOption < ActiveRecord::Migration[7.0]
  def change
    # Enum defined in /app/models/concerns/auto_snapshots_optionable.rb
    add_column :settings, :auto_snapshots_option, :integer, default: 0, null: false
    add_column :projects, :auto_snapshots_option, :integer
    add_column :documents, :auto_snapshots_option, :integer
  end
end
