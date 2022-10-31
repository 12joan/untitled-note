class FileStorageAPI < ApplicationAPI
  def quota_usage
    @user.reload
    { quota: @user.storage_quota, used: @user.storage_used }
  end

  def files
    @user.s3_files.order(size: :desc).map do |s3_file|
      s3_file.query(:all)
    end
  end
end
