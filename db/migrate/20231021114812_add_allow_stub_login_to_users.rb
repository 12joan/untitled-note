class AddAllowStubLoginToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :allow_stub_login, :boolean, default: false, null: false
  end
end
