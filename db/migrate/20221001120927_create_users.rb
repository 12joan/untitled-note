class CreateUsers < ActiveRecord::Migration[6.1]
  def up
    create_table :users do |t|
      t.string :auth0_id
      t.string :name, null: false, default: ''

      t.timestamps
    end

    User.create!(id: 1, auth0_id: '', name: 'Default User')
  end

  def down
    drop_table :users
  end
end
