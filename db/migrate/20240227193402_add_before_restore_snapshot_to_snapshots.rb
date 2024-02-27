class AddBeforeRestoreSnapshotToSnapshots < ActiveRecord::Migration[7.0]
  def change
    add_reference :snapshots, :before_restore_snapshot, null: true, foreign_key: { to_table: :snapshots }
  end
end
