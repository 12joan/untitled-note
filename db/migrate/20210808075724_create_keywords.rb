class CreateKeywords < ActiveRecord::Migration[6.1]
  def change
    create_table :keywords do |t|
      t.string :text
      t.references :project, null: false, foreign_key: true

      t.timestamps

      t.index [:text, :project_id], unique: true
    end
  end
end
