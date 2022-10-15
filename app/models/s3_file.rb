class S3File < ApplicationRecord
  belongs_to :project

  validates :role, presence: true
  validates :s3_key, presence: true
  validates :filename, presence: true
  validates :size, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :content_type, presence: true

  after_destroy do
    s3_object.delete if uploaded?(update_cache: false)
  end

  def self.not_uploaded
    where(uploaded_cache: false).filter { |s3_file| !s3_file.uploaded? }
  end

  def uploaded?(update_cache: true)
    uploaded_cache? || check_uploaded(update_cache: update_cache)
  end

  private

  def check_uploaded(update_cache:)
    s3_object.exists?.tap do |exists|
      self.uploaded_cache = exists if update_cache
    end
  end

  def s3_object
    Rails.application.config.s3_bucket.object(s3_key)
  end
end
