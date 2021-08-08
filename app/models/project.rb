class Project < ApplicationRecord
  has_many :documents, dependent: :destroy
  has_many :keywords, dependent: :destroy

  validates :name, presence: true
end
