class Keyword < ApplicationRecord
  belongs_to :project
  has_and_belongs_to_many :documents

  validates :text, uniqueness: { scope: :project }
end
