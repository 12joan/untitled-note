class AddPlainBodyToDocument < ActiveRecord::Migration[6.1]
  def up
    add_column :documents, :plain_body, :text

    Document.find_each do |document|
      unless document.body.body.nil?
        document.update_column(:plain_body, document.body.body.to_plain_text)
      end
    end
  end

  def down
    remove_column :documents, :plain_body
  end
end
