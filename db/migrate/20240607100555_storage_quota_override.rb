class StorageQuotaOverride < ActiveRecord::Migration[7.0]
  def up
    rename_column :users, :storage_quota, :storage_quota_override
    change_column_null :users, :storage_quota_override, true
    change_column_default :users, :storage_quota_override, nil

    User.find_each do |user|
      if user.storage_quota_override == 10485760
        user.update_column(:storage_quota_override, nil)
      end
    end
  end

  def down
    User.find_each do |user|
      if user.storage_quota_override.nil?
        user.update_column(:storage_quota_override, 10485760)
      end
    end

    change_column_default :users, :storage_quota_override, 10485760
    change_column_null :users, :storage_quota_override, false
    rename_column :users, :storage_quota_override, :storage_quota
  end
end
