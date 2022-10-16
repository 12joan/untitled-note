module CleanUpS3Files
  def self.perform
    S3File.not_uploaded { where('created_at < ?', 1.hour.ago) }.each(&:destroy)
  end
end
