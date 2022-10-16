class S3File < ApplicationRecord
  belongs_to :project
  has_one :owner, through: :project, source: :owner

  validates :role, presence: true
  validates :s3_key, presence: true
  validates :filename, presence: true
  validates :size, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :content_type, presence: true

  include Queryable.permit(*%i[id role s3_key filename size content_type created_at])

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
    )
  end

  def url
    s3_object.presigned_url(:get, expires_in: 1.hour)
  end

  def uploaded?(update_cache: true)
    uploaded_cache? || check_uploaded(update_cache: update_cache)
  end

  private

  def check_uploaded(update_cache:)
    s3_object.exists?.tap do |exists|
      update_column(:uploaded_cache, exists) if update_cache
    end
  end

  def s3_object
    Rails.application.config.s3_bucket.object(s3_key)
  end
end
