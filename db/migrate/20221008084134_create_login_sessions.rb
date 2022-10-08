class CreateLoginSessions < ActiveRecord::Migration[6.1]
  def change
    create_table :login_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :token, null: false
      t.string :user_agent, null: false, default: ''

      t.timestamps
    end
  end
end
