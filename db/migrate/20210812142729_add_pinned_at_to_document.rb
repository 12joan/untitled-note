class AddPinnedAtToDocument < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :pinned_at, :datetime
  end
end
