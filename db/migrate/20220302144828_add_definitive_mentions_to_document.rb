class AddDefinitiveMentionsToDocument < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :definitive_mentions, :text
  end
end
