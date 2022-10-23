class AddBackgroundColourAndEmojiToProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :projects, :background_colour, :string, default: 'auto', null: false
    add_column :projects, :emoji, :string
  end
end
