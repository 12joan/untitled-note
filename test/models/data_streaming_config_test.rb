require 'test_helper'

class DataStreamingConfigTest < ActiveSupport::TestCase
  User = Struct.new(:id, :posts, keyword_init: true)
  Post = Struct.new(:id, :user_id, keyword_init: true)

  UsersAPI = Class.new
  PostsAPI = Class.new

  setup do
    @data_streaming_config = DataStreamingConfig.new(
      apis: {
        User: {
          api_controller: UsersAPI,
          actions: {
            index: ->(params) { 'User#index' },
            show: ->(params) { "User#show(#{params.fetch(:id)})" },
          },
        },

        Post: {
          api_controller: PostsAPI,
          actions: {
            index: ->(params) { "Post#index(#{params.fetch(:user_id)})" },
            show: ->(params) { "Post#show(#{params.fetch(:user_id)}, #{params.fetch(:id)})" },
          },
        },
      },

      listeners: {
        User: ->(user) do
          broadcast 'User#index'
          broadcast "User#show(#{user.id})"

          user.posts.each do |post|
            broadcast_for post
          end
        end,

        Post: ->(post) do
          broadcast "Post#index(#{post.user_id})"
          broadcast "Post#show(#{post.user_id}, #{post.id})"
        end,
      },
    )

    @user = User.new(id: 1, posts: [])

    @user.posts << Post.new(id: 101, user_id: @user.id)
    @user.posts << Post.new(id: 102, user_id: @user.id)
    @user.posts << Post.new(id: 103, user_id: @user.id)

    @post = @user.posts.first
  end

  test 'api_controller_for_model' do
    assert_equal UsersAPI, @data_streaming_config.api_controller_for_model(:User)
    assert_equal PostsAPI, @data_streaming_config.api_controller_for_model(:Post)
  end

  test 'api_controller_for_model when model is not found' do
    assert_raises(StandardError) do
      @data_streaming_config.api_controller_for_model(:not_a_model)
    end
  end

  test 'allowed_actions_for_model' do
    assert_equal [:index, :show].to_set, @data_streaming_config.allowed_actions_for_model(:User)
    assert_equal [:index, :show].to_set, @data_streaming_config.allowed_actions_for_model(:Post)
  end

  test 'allowed_actions_for_model when model is not found' do
    assert_raises(StandardError) do
      @data_streaming_config.allowed_actions_for_model(:not_a_model)
    end
  end

  test 'broadcasting_for_action' do
    assert_equal 'User#index', @data_streaming_config.broadcasting_for_action(:User, :index, {})
    assert_equal 'User#show(1)', @data_streaming_config.broadcasting_for_action(:User, :show, { id: 1 })
    assert_equal 'Post#index(1)', @data_streaming_config.broadcasting_for_action(:Post, :index, { user_id: 1 })
    assert_equal 'Post#show(1, 101)', @data_streaming_config.broadcasting_for_action(:Post, :show, { id: 101, user_id: 1 })
  end

  test 'broadcasting_for_action when model is not found' do
    assert_raises(StandardError) do
      @data_streaming_config.broadcasting_for_action(:not_a_model, :index, {})
    end
  end

  test 'broadcasting_for_action when action is not found' do
    assert_raises(StandardError) do
      @data_streaming_config.broadcasting_for_action(:User, :not_an_action, {})
    end
  end

  test 'broadcasting_for_action when required param is missing' do
    assert_raises(StandardError) do
      @data_streaming_config.broadcasting_for_action(:User, :show, { not_id: 1 })
    end
  end

  test 'broadcastings_for_record' do
    assert_equal \
      ['User#index', 'User#show(1)', 'Post#index(1)', 'Post#show(1, 101)', 'Post#show(1, 102)', 'Post#show(1, 103)'].to_set,
      @data_streaming_config.broadcastings_for_record(@user)

    assert_equal \
      ['Post#index(1)', 'Post#show(1, 101)'].to_set,
      @data_streaming_config.broadcastings_for_record(@post)
  end

  test 'broadcastings_for_record when record class is not found' do
    assert_raises(StandardError) do
      @data_streaming_config.broadcastings_for_record(Class.new.new)
    end
  end
end
