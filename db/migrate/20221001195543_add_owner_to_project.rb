class AddOwnerToProject < ActiveRecord::Migration[6.1]
  def change
    add_reference :projects, :owner, null: false, foreign_key: { to_table: :users }, index: true, default: 1
  end
end
