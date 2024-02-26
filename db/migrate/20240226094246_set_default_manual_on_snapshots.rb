class SetDefaultManualOnSnapshots < ActiveRecord::Migration[7.0]
  def up
    change_column_default :snapshots, :manual, true

    Snapshot.find_each do |snapshot|
      snapshot.update!(manual: true)
    end
  end

  def down
    change_column_default :snapshots, :manual, false
  end
end
