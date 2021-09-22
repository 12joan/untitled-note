class Keyword < ApplicationRecord
  belongs_to :project
  has_many :documents_keywords, dependent: :destroy
  has_many :documents, through: :documents_keywords

  validates :text, presence: true, uniqueness: { scope: :project }

  include Queryable.permit(*%i[id text project_id created_at updated_at])
end
