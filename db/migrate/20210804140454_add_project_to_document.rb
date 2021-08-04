class AddProjectToDocument < ActiveRecord::Migration[6.1]
  def change
    Document.destroy_all
    add_reference :documents, :project, null: false, foreign_key: true
  end
end
