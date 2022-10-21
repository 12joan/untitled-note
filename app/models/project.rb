class Project < ApplicationRecord
  belongs_to :owner, class_name: 'User', inverse_of: :projects
  has_many :documents, dependent: :destroy
  has_many :tags, dependent: :destroy
  has_many :s3_files, dependent: :destroy
  belongs_to :image, class_name: 'S3File', optional: true

  validates :name, presence: true

  include Queryable.permit(*%i[id name image_url created_at updated_at archived_at])
  include Listenable

  after_create do
    update!(list_index: id)
  end

  def image_url
    image&.url
  end
end
