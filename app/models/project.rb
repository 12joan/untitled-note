class Project < ApplicationRecord
  has_many :documents, dependent: :destroy
end
