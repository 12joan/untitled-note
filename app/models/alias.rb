class Alias < ApplicationRecord
  belongs_to :document

  validates :text, presence: true, unless: :title?
end
