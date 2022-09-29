class RenameKeywordsToTags < ActiveRecord::Migration[6.1]
  def change
    rename_table :keywords, :tags

    rename_table :documents_keywords, :documents_tags
    rename_column :documents_tags, :keyword_id, :tag_id
  end
end
