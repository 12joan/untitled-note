class DropAliases < ActiveRecord::Migration[6.1]
  def change
    drop_table :aliases
  end
end
