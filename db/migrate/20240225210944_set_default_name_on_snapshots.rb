class SetDefaultNameOnSnapshots < ActiveRecord::Migration[7.0]
  def change
    change_column_default :snapshots, :name, from: nil, to: ''
  end
end
