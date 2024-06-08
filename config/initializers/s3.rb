if Rails.env.test?
  class NotImplementedBucket
    def objects
      not_implemented
    end

    def method_missing(*args)
      not_implemented
    end

    private

    def not_implemented
      raise 'S3 is not configured for test environment'
    end
  end

  Rails.application.config.s3_bucket = NotImplementedBucket.new
  Rails.application.config.external_s3_bucket = NotImplementedBucket.new
else
  client_options = {
    region: ENV.fetch('AWS_REGION', 'us-east-1'),
    force_path_style: true,
  }

  internal_endpoint = ENV.fetch('S3_ENDPOINT', nil)
  external_endpoint = ENV.fetch('S3_EXTERNAL_ENDPOINT', internal_endpoint)

  internal_client = Aws::S3::Client.new(
    endpoint: internal_endpoint,
    **client_options
  )

  external_client = Aws::S3::Client.new(
    endpoint: external_endpoint,
    **client_options
  )

  internal_s3 = Aws::S3::Resource.new(client: internal_client)
  external_s3 = Aws::S3::Resource.new(client: external_client)

  bucket_name = ENV.fetch('S3_BUCKET');
  internal_bucket = internal_s3.bucket(bucket_name)
  external_bucket = external_s3.bucket(bucket_name)

  internal_bucket.create unless internal_bucket.exists?

  Rails.application.config.s3_bucket = internal_bucket
  Rails.application.config.external_s3_bucket = external_bucket
end
