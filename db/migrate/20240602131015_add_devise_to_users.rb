# frozen_string_literal: true

class AddDeviseToUsers < ActiveRecord::Migration[7.0]
  def self.up
    change_table :users do |t|
      ## Database authenticatable
      t.string :email, null: true, default: ""
      User.find_each do |user|
        if user.name.empty? || user.name == 'Stub User'
          user.destroy
        else 
          user.update_column(:email, user.name) # Migrate from Auth0
        end
      end
      t.change :email, :string, null: false
      t.string :encrypted_password, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      # t.integer  :sign_in_count, default: 0, null: false
      # t.datetime :current_sign_in_at
      # t.datetime :last_sign_in_at
      # t.string   :current_sign_in_ip
      # t.string   :last_sign_in_ip

      ## Confirmable
      t.string   :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      t.string   :unconfirmed_email # Only if using reconfirmable

      User.find_each do |user|
        user.update_column(:confirmed_at, Time.now)
      end

      ## Lockable
      # t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
      # t.string   :unlock_token # Only if unlock strategy is :email or :both
      # t.datetime :locked_at


      # Uncomment below if timestamps were not included in your original model.
      # t.timestamps null: false

      t.remove :name
      t.remove :auth0_id
      t.remove :allow_stub_login
    end

    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    # add_index :users, :unlock_token,         unique: true
  end

  def down
    add_column :users, :auth0_id, :string
    add_column :users, :name, :string, null: false, default: ''
    add_column :users, :allow_stub_login, :boolean, default: false, null: false

    User.find_each do |user|
      user.update_column(:name, user.email)
    end

    remove_columns :users, *%i[
      email
      encrypted_password
      reset_password_token
      reset_password_sent_at
      remember_created_at
      confirmation_token
      confirmed_at
      confirmation_sent_at
      unconfirmed_email
    ]
  end
end
