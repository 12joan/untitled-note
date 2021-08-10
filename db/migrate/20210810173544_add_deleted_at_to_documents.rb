class AddDeletedAtToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :deleted_at, :datetime
  end
end
