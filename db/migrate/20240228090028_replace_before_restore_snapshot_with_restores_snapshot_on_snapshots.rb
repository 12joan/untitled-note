class ReplaceBeforeRestoreSnapshotWithRestoresSnapshotOnSnapshots < ActiveRecord::Migration[7.0]
  def change
    remove_column :snapshots, :before_restore_snapshot_id
    add_reference :snapshots, :restores_snapshot, null: true, foreign_key: { to_table: :snapshots }
  end
end
