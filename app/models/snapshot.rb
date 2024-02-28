class SnapshotValidator < ActiveModel::Validator
  def validate(record)
    if record.document.body_type != 'json/slate'
      record.errors.add :document, 'must be a JSON Slate document'
    end

    if record.restores_snapshot&.restores_snapshot&.present?
      record.errors.add :restores_snapshot, 'cannot be a restore snapshot'
    end
  end
end

class Snapshot < ApplicationRecord
  belongs_to :document
  has_one :owner, through: :document

  belongs_to :restores_snapshot,
    optional: true,
    class_name: 'Snapshot',
    inverse_of: :restoring_snapshots

  has_many :restoring_snapshots,
    class_name: 'Snapshot',
    foreign_key: :restores_snapshot_id,
    inverse_of: :restores_snapshot,
    dependent: :nullify

  validates_with SnapshotValidator

  include Queryable.permit(*%i[id name manual body restores_snapshot document_id created_at updated_at])
  include Listenable

  def restores_snapshot_or_self
    restores_snapshot || self
  end
end
