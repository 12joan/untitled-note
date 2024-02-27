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

  belongs_to :before_restore_snapshot,
    optional: true,
    class_name: 'Snapshot',
    inverse_of: :restoring_snapshots

  has_many :restoring_snapshots,
    class_name: 'Snapshot',
    foreign_key: :before_restore_snapshot_id,
    inverse_of: :before_restore_snapshot,
    dependent: :nullify

  validates_with SnapshotDocumentValidator

  include Queryable.permit(*%i[id name manual body before_restore document_id created_at updated_at])
  include Listenable

  def before_restore
    return nil if before_restore_snapshot.nil?

    before_restore_snapshot.query(
      name: true,
      created_at: true,
    ).merge(
      is_unrestore: before_restore_snapshot.before_restore_snapshot.present?,
    )
  end
end
