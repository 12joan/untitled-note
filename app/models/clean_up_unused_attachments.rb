module CleanUpUnusedAttachments
  def self.perform
    S3File
      .attachments
      .where('became_unused_at < ?', 24.hours.ago)
      .where(do_not_delete_unused: false)
      .find_each do |s3_file|
        # Double check became_unused_at
        s3_file.update_unused
        s3_file.destroy! if s3_file.unused?
      end
  end
end
