require 'test_helper'

class DataStreamingConfigTest < ActiveSupport::TestCase
  User = Struct.new(:id, :name)
  CommentThread = Struct.new(:id, :user_id, :posts, keyword_init: true)
  Post = Struct.new(:id, :comment_thread_id, keyword_init: true)

  CommentThreadsAPI = Class.new
  PostsAPI = Class.new

  setup do
    @data_streaming_config = DataStreamingConfig.new(
      apis: {
        CommentThread: {
          api_controller: CommentThreadsAPI,
          actions: {
            index: ->(params) { "CommentThread#index(#{params.fetch(:user_id)})" },
            show: ->(params) { "CommentThread#show(#{params.fetch(:id)})" },
          },
        },

        Post: {
          api_controller: PostsAPI,
          actions: {
            index: ->(params) { "Post#index(#{params.fetch(:comment_thread_id)})" },
            show: ->(params) { "Post#show(#{params.fetch(:comment_thread_id)}, #{params.fetch(:id)})" },
          },
        },
      },

      listeners: {
        CommentThread: ->(comment_thread) do
          broadcast "CommentThread#index(#{comment_thread.user_id})"
          broadcast "CommentThread#show(#{comment_thread.id})"

          comment_thread.posts.each do |post|
            broadcast_for post
          end
        end,

        Post: ->(post) do
          broadcast "Post#index(#{post.comment_thread_id})"
          broadcast "Post#show(#{post.comment_thread_id}, #{post.id})"
        end,
      },
    )

    @user = User.new(1, 'Autumn')
    @comment_thread = CommentThread.new(id: 1, user_id: @user.id, posts: [])

    @comment_thread.posts << Post.new(id: 101, comment_thread_id: @comment_thread.id)
    @comment_thread.posts << Post.new(id: 102, comment_thread_id: @comment_thread.id)
    @comment_thread.posts << Post.new(id: 103, comment_thread_id: @comment_thread.id)

    @post = @comment_thread.posts.first
  end

  test 'api_controller_for_model' do
    assert_equal CommentThreadsAPI, @data_streaming_config.api_controller_for_model(:CommentThread)
    assert_equal PostsAPI, @data_streaming_config.api_controller_for_model(:Post)
  end

  test 'api_controller_for_model when model is not found' do
    assert_raises(StandardError) do
      @data_streaming_config.api_controller_for_model(:not_a_model)
    end
  end

  test 'allowed_actions_for_model' do
    assert_equal [:index, :show].to_set, @data_streaming_config.allowed_actions_for_model(:CommentThread)
    assert_equal [:index, :show].to_set, @data_streaming_config.allowed_actions_for_model(:Post)
  end

  test 'allowed_actions_for_model when model is not found' do
    assert_raises(StandardError) do
      @data_streaming_config.allowed_actions_for_model(:not_a_model)
    end
  end

  test 'broadcasting_for_action' do
    assert_equal 'CommentThread#index(1)', @data_streaming_config.broadcasting_for_action(:CommentThread, :index, {}, @user)
    assert_equal 'CommentThread#show(1)', @data_streaming_config.broadcasting_for_action(:CommentThread, :show, { id: 1 }, @user)
    assert_equal 'Post#index(1)', @data_streaming_config.broadcasting_for_action(:Post, :index, { comment_thread_id: 1 }, @user)
    assert_equal 'Post#show(1, 101)', @data_streaming_config.broadcasting_for_action(:Post, :show, { id: 101, comment_thread_id: 1 }, @user)
  end

  test 'broadcasting_for_action when model is not found' do
    assert_raises(StandardError) do
      @data_streaming_config.broadcasting_for_action(:not_a_model, :index, {}, @user)
    end
  end

  test 'broadcasting_for_action when action is not found' do
    assert_raises(StandardError) do
      @data_streaming_config.broadcasting_for_action(:CommentThread, :not_an_action, {}, @user)
    end
  end

  test 'broadcasting_for_action when required param is missing' do
    assert_raises(StandardError) do
      @data_streaming_config.broadcasting_for_action(:CommentThread, :show, { not_id: 1 }, @user)
    end
  end

  test 'broadcastings_for_record' do
    assert_equal \
      ['CommentThread#index(1)', 'CommentThread#show(1)', 'Post#index(1)', 'Post#show(1, 101)', 'Post#show(1, 102)', 'Post#show(1, 103)'].to_set,
      @data_streaming_config.broadcastings_for_record(@comment_thread)

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
