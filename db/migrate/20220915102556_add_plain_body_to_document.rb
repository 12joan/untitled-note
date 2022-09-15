class AddPlainBodyToDocument < ActiveRecord::Migration[6.1]
  def up
    add_column :documents, :plain_body, :text, default: '', null: false
    Document.find_each(&:extract_plain_body)
  end

  def down
    remove_column :documents, :plain_body
  end
end
