require 'test_helper'

class ApplicationCable::ConnectionTest < ActionCable::Connection::TestCase
  test 'connects with session' do
    user = create(:user)
    connect session: { user_id: user.id }
    assert_equal user, connection.user
  end
end
