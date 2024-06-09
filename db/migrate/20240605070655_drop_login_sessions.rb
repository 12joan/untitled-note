class DropLoginSessions < ActiveRecord::Migration[7.0]
  def up
    drop_table :login_sessions
  end

  def down
    create_table :login_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :token, null: false
      t.string :user_agent, null: false, default: ''

      t.timestamps
    end
  end
end
