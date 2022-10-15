if Rails.env.test?
  Rails.application.config.s3_bucket = Class.new do
    def method_missing
      raise 'S3 is not configured for test environment'
    end
  end.new
else
  client = Aws::S3::Client.new(
    endpoint: ENV.fetch('S3_ENDPOINT'),
    region: ENV.fetch('AWS_REGION'),
    force_path_style: true,
  )

  s3 = Aws::S3::Resource.new(client: client)

  Rails.application.config.s3_bucket = s3.bucket(ENV.fetch('S3_BUCKET')).tap do |bucket|
    bucket.create unless bucket.exists?
  end
end
