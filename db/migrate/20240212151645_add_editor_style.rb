class AddEditorStyle < ActiveRecord::Migration[7.0]
  def change
    # Enum defined in the /app/models/concerns/editor_stylable.rb
    add_column :projects, :editor_style, :integer
    add_column :documents, :editor_style, :integer
  end
end
