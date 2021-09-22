require 'test_helper'

class QueryableTest < ActiveSupport::TestCase
  User = Struct.new(:id, :name, :email, :posts, :avatar, keyword_init: true) do
    include Queryable.permit(:id, :name, :email, :posts, :avatar)

    def destroy
      warn '#destroy method called'
    end
  end

  Post = Struct.new(:id, :user_id, :title, :body, keyword_init: true) do
    include Queryable.permit(:id, :title, :body)
  end

  Avatar = Struct.new(:id, :user_id, :path, keyword_init: true) do
    include Queryable.permit(:id, :path)
  end

  setup do
    @user = User.new(
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      posts: [
        Post.new(id: 101, user_id: 1, title: 'Post 1', body: 'Hello'),
        Post.new(id: 102, user_id: 1, title: 'Post 2', body: 'World'),
      ],
      avatar: Avatar.new(id: 201, user_id: 1, path: '/images/avatar.png'),
    )
  end

  test 'can query a subset of permitted attributes' do
    assert_equal \
      ({ name: 'Alice', avatar: { path: '/images/avatar.png' } }),
      @user.query(name: true, avatar: { path: true })

    assert_equal \
      ({ email: 'alice@example.com', posts: [{ title: 'Post 1' }, { title: 'Post 2' }] }),
      @user.query(email: true, posts: { title: true })
  end

  test 'cannot query unpermitted attributes' do
    assert_raises(StandardError) do
      @user.query(destroy: true)
    end

    assert_raises(StandardError) do
      @user.query(name: true, avatar: { user_id: true })
    end
  end

  test 'can query all attributes' do
    assert_equal \
      ({ name: 'Alice', avatar: { id: 201, path: '/images/avatar.png' }}),
      @user.query(name: true, avatar: :all)

    assert_equal \
      ({ posts: [{ id: 101, title: 'Post 1', body: 'Hello' }, { id: 102, title: 'Post 2', body: 'World' }] }),
      @user.query(posts: :all)
  end
end
