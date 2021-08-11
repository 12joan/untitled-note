class AddBlankToDocument < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :blank, :boolean, default: false, null: false
  end
end
