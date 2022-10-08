require 'test_helper'

class ApplicationCable::ConnectionTest < ActionCable::Connection::TestCase
  include LoginSessions

  test 'connects when user is logged in' do
    user = create(:user)
    create_login_session(user)
    # ActionCable::Connection::TestCase cannot handle cookies as hashes
    cookies[:login_session_token] = cookies[:login_session_token][:value]
    connect
    assert_equal user, connection.user
  end

  test 'rejects connection when user is not logged in' do
    assert_reject_connection { connect }
  end

  private

  # Used by SessionHelper
  def request
    Struct.new(:user_agent, :ssl?).new('Test user agent', false)
  end
end
