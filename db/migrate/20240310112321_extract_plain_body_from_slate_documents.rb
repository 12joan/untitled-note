class ExtractPlainBodyFromSlateDocuments < ActiveRecord::Migration[7.0]
  def up
    Document.find_each do |document|
      if document.extract_plain_body
        document.save!
      end
    end
  end
  
  def down
    # Nothing to do
  end
end
