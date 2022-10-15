class Project < ApplicationRecord
  belongs_to :owner, class_name: 'User', inverse_of: :projects
  has_many :documents, dependent: :destroy
  has_many :tags, dependent: :destroy
  has_many :s3_files, dependent: :destroy

  validates :name, presence: true

  include Queryable.permit(*%i[id name created_at updated_at])
  include Listenable
end
