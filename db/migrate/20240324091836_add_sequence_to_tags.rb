class AddSequenceToTags < ActiveRecord::Migration[7.0]
  def change
    add_column :tags, :sequence, :boolean, default: false, null: false
  end
end
