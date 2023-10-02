class AddLockedAtToDocuments < ActiveRecord::Migration[7.0]
  def change
    add_column :documents, :locked_at, :datetime
  end
end
