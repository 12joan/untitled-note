require 'test_helper'

class QueryableTest < ActiveSupport::TestCase
  User = Struct.new(:id, :name, :email, :password, keyword_init: true) do
    include Queryable.permit(:id, :name, :email)

    def destroy
      warn '#destroy method called'
    end
  end

  setup do
    @user = User.new(
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password',
    )
  end

  test 'can query a subset of permitted attributes' do
    assert_equal({ name: 'Alice' }, @user.query(name: true))
    assert_equal({ email: 'alice@example.com' }, @user.query(email: true))
  end

  test 'cannot query unpermitted attributes' do
    assert_raises(StandardError) do
      @user.query(destroy: true)
    end

    assert_raises(StandardError) do
      @user.query(name: true, password: true)
    end
  end

  test 'can query all attributes' do
    assert_equal(
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      @user.query('all')
    )
  end
end
