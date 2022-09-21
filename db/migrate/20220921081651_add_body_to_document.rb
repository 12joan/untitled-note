class AddBodyToDocument < ActiveRecord::Migration[6.1]
  def up
    add_column :documents, :body, :text, null: false, default: ''
    add_column :documents, :body_type, :string, null: false, default: 'empty'

    document_bodies = ActiveRecord::Base.connection.exec_query(<<~SQL)
      SELECT documents.id as document_id, action_text_rich_texts.body
      FROM documents, action_text_rich_texts
      WHERE documents.id = action_text_rich_texts.record_id;
    SQL

    document_bodies.each do |document_body|
      document = Document.find(document_body['document_id'])
      document.update_attribute(:body, document_body['body'] || '')
      document.update_attribute(:body_type, 'html/trix')
    end

    drop_table :action_text_rich_texts
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
