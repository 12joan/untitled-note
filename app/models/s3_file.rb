class S3File < ApplicationRecord
  belongs_to :project
  has_one :owner, through: :project, source: :owner
  has_many :used_as_image_in_projects, class_name: 'Project', foreign_key: 'image_id', dependent: :nullify

  validates :role, presence: true
  validates :s3_key, presence: true
  validates :filename, presence: true
  validates :size, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :content_type, presence: true

  include Queryable.permit(*%i[id project_id role s3_key filename size content_type url created_at])
  include Listenable

  INLINE_CONTENT_TYPES = %w[
    application/pdf
    image/apng
    image/gif
    image/jpeg
    image/png
    image/webp
    video/mpeg
    video/mp4
    video/ogg
    video/quicktime
    video/webm
    audio/mpeg
    audio/ogg
    audio/aac
    audio/flac
    audio/mp4
    audio/x-wav
    audio/wave
    audio/wav
    audio/webm
  ].freeze

  before_create do
    owner.update_storage_used(size)
  end

  after_destroy do
    s3_object.delete if uploaded?(update_cache: false)
    owner.update_storage_used(-size)
  end

  def self.not_uploaded(&get_collection)
    collection = block_given? ? instance_eval(&get_collection) : all
    collection.where(uploaded_cache: false).filter { |s3_file| !s3_file.uploaded? }
  end

  def presigned_post
    s3_object.presigned_post(
      key: s3_key,
      success_action_status: '201',
      content_type: content_type,
      content_length_range: 0..size,
      cache_control: 'max-age=31536000, private',
    )
  end

  def url
    redis = Rails.application.config.redis
    redis_key = "s3_file:#{id}:url"

    redis.get(redis_key) || generate_url.tap do |url|
      redis.set(redis_key, url, ex: 6.days.to_i)
    end
  end

  def uploaded?(update_cache: true)
    uploaded_cache? || check_uploaded(update_cache: update_cache)
  end

  private

  def generate_url
    inline_safe = INLINE_CONTENT_TYPES.include?(content_type)

    s3_object.presigned_url(
      :get,
      expires_in: 7.days.to_i,
      response_content_type: inline_safe ? content_type : 'application/octet-stream',
      response_content_disposition: "#{inline_safe ? 'inline' : 'attachment'}; filename=\"#{filename}\"",
    )
  end

  def check_uploaded(update_cache:)
    s3_object.exists?.tap do |exists|
      update_column(:uploaded_cache, exists) if update_cache
    end
  end

  def s3_object
    Rails.application.config.s3_bucket.object(s3_key)
  end
end
