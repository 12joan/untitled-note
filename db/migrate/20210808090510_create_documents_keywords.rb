class CreateDocumentsKeywords < ActiveRecord::Migration[6.1]
  def change
    create_table :documents_keywords do |t|
      t.references :document, null: false, foreign_key: true
      t.references :keyword, null: false, foreign_key: true

      t.timestamps

      t.index [:document_id, :keyword_id], unique: true
    end
  end
end
