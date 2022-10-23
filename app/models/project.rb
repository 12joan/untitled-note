class Project < ApplicationRecord
  belongs_to :owner, class_name: 'User', inverse_of: :projects
  has_many :documents, dependent: :destroy
  has_many :tags, dependent: :destroy
  has_many :s3_files, dependent: :destroy
  belongs_to :image, class_name: 'S3File', optional: true

  validates :name, presence: true
  validates :background_colour, inclusion: { in: %w[auto light dark] }
  validates :emoji, presence: true, allow_nil: true

  include Queryable.permit(*%i[id name image_url emoji background_colour created_at updated_at archived_at])
  include Listenable

  after_create do
    update!(list_index: id)
  end

  def image_url
    image&.url
  end
end
