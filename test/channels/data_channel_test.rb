require 'test_helper'

class DataChannelTest < ActionCable::Channel::TestCase
  setup do
    @project = create(:project)
    @params = {
      'project_id' => @project.id,
      'query' => {
        'title' => true,
        'body_content' => true,
        'tags' => {
          'id' => true,
          'text' => true,
        },
      },
    }
  end

  test 'transmits the API result on subscribe' do
    mock = stub_api(return_value: 'return value', expected_params: @params) do
      subscribe \
        model: 'Document',
        action: 'index',
        params: @params

      assert subscription.confirmed?
      assert_equal '"return value"', transmissions.first
    end

    assert_mock mock
  end

  test 'cannot invoke unpermitted action on API' do
    assert_raises(StandardError) do
      subscribe \
        model: 'Document',
        action: 'inspect',
        params: @params
    end
  end

  test 'retransmits the API result when a relevant broadcasting is received' do
    stub_api(return_value: 'return value') do
      subscribe \
        model: 'Document',
        action: 'index',
        params: @params

      # No way of triggering the stream_from callback in test environment
      # Compromise by asserting it has the right stream
      assert_has_stream "Document#index(project_id: #{@project.id})"
    end
  end

  private

  def stub_api(return_value:, expected_params: nil, &block)
    mock = Minitest::Mock.new
    mock.expect :index, return_value

    stubbed_new = proc do |params|
      unless expected_params.nil?
        assert_equal expected_params, params
      end

      mock
    end

    DocumentsAPI.stub :new, stubbed_new, &block

    return mock
  end
end
