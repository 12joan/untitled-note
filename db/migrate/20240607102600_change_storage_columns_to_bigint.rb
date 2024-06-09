class ChangeStorageColumnsToBigint < ActiveRecord::Migration[7.0]
  def up
    change_column :users, :storage_used, :bigint
    change_column :users, :storage_quota_override, :bigint
    change_column :s3_files, :size, :bigint
  end

  def down
    change_column :s3_files, :size, :int
    change_column :users, :storage_quota_override, :int
    change_column :users, :storage_used, :int
  end
end
