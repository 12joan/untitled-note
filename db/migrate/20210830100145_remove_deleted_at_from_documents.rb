class RemoveDeletedAtFromDocuments < ActiveRecord::Migration[6.1]
  def up
    Document.where.not(deleted_at: nil).destroy_all
    remove_column :documents, :deleted_at
  end

  def down
    add_column :documents, :deleted_at, :datetime
  end
end
