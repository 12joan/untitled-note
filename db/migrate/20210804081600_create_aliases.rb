class CreateAliases < ActiveRecord::Migration[6.1]
  def change
    create_table :aliases do |t|
      t.string :text
      t.references :document, null: false, foreign_key: true
      t.boolean :title, default: false

      t.timestamps
    end
  end
end
