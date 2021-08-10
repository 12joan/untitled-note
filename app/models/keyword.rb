class Keyword < ApplicationRecord
  belongs_to :project
  has_many :documents_keywords, dependent: :destroy
  has_many :documents, through: :documents_keywords

  validates :text, uniqueness: { scope: :project }
end
