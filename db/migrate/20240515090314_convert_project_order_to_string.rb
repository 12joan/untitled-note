class ConvertProjectOrderToString < ActiveRecord::Migration[7.0]
  def up
    add_column :projects, :order_string, :string, null: true

    User.find_each do |user|
      user.projects.order(:list_index).all.each_with_index do |project, index|
        project.update_column(
          :order_string,
          ProjectOrderMigration.hex_for_int_order(index)
        )
      end
    end

    remove_column :projects, :list_index
    change_column :projects, :order_string, :string, null: false
  end

  def down
    add_column :projects, :list_index, :integer, null: true

    User.find_each do |user|
      user.projects.order(:order_string).all.each_with_index do |project, index|
        project.update_column(:list_index, index)
      end
    end

    remove_column :projects, :order_string

    # Oversight: list_index was null prior to this migration, although no null
    # values existed. Leave it null here for consistency.
  end
end
