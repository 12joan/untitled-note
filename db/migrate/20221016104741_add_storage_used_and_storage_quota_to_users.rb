class AddStorageUsedAndStorageQuotaToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :storage_used, :integer, null: false, default: 0
    add_column :users, :storage_quota, :integer, null: false, default: 10 * 1024 * 1024
  end
end
