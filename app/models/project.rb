class Project < ApplicationRecord
  has_many :documents, dependent: :destroy
  has_many :tags, dependent: :destroy

  validates :name, presence: true

  include Queryable.permit(*%i[id name created_at updated_at])
  include Listenable
end
