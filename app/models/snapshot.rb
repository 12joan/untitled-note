class SnapshotDocumentValidator < ActiveModel::Validator
  def validate(record)
    if record.document.body_type != 'json/slate'
      record.errors.add :document, 'must be a JSON Slate document'
    end
  end
end

class Snapshot < ApplicationRecord
  belongs_to :document
  has_one :owner, through: :document

  validates :name, presence: true
  validates_with SnapshotDocumentValidator

  include Queryable.permit(*%i[id name manual body created_at updated_at])
  include Listenable
end
