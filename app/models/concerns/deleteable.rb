module Deleteable
  extend ActiveSupport::Concern

  included do
    scope :deleted, -> { where.not(deleted_at: nil) }
    scope :not_deleted, -> { where(deleted_at: nil) }
  end

  def deleted?
    deleted_at.present?
  end

  def mark_for_soft_deletion
    self.deleted_at = DateTime.now
  end

  def soft_delete
    update(deleted_at: DateTime.now)
  end
end
