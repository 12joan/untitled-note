class AddBecameUnusedAtToS3Files < ActiveRecord::Migration[7.0]
  def up
    add_column :s3_files, :became_unused_at, :timestamp, null: true
    add_column :s3_files, :do_not_delete_unused, :boolean, null: false, default: false

    # Flag all existing files as "do not delete"
    S3File.attachments.update_all(do_not_delete_unused: true)

    S3File.find_each(&:update_unused)
  end

  def down
    remove_column :s3_files, :became_unused_at
    remove_column :s3_files, :do_not_delete_unused
  end
end
