class Project < ApplicationRecord
  has_many :documents, dependent: :destroy

  validates :name, presence: true
end
