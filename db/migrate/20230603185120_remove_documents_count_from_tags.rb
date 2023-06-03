class RemoveDocumentsCountFromTags < ActiveRecord::Migration[7.0]
  def change
    remove_column :tags, :documents_count
  end
end
