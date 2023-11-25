module CleanUpUntrackedS3Objects
  def self.perform
    Rails.application.config.s3_bucket.objects.each do |object|
      if S3File.find_by(s3_key: object.key).nil?
        object.delete
      end
    end
  end
end
