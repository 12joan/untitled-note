class CreateSnapshots < ActiveRecord::Migration[7.0]
  def change
    create_table :snapshots do |t|
      t.references :document, null: false, foreign_key: true
      t.string :name, null: false
      t.boolean :manual, null: false, default: false
      t.text :body, null: false
      t.timestamps
    end
  end
end
