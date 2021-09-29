require 'test_helper'

class ListenableTest < ActiveSupport::TestCase
  class ActiveRecordDouble
    def self.after_commit(&block)
      @@after_commit = block
    end

    def run_after_commit
      instance_eval &@@after_commit
    end

    include Listenable
  end

  include ActionCable::TestHelper

  setup do
    @record = ActiveRecordDouble.new
  end

  test 'broadcasts a message on all configured broadcastings' do
    mock = Minitest::Mock.new
    mock.expect :broadcastings_for_record, ['broadcasting_1', 'broadcasting_2'], [@record]

    Rails.application.config.stub :data_streaming_config, mock do
      assert_broadcasts('broadcasting_1', 1) do
        assert_broadcasts('broadcasting_2', 1) do
          @record.run_after_commit
        end
      end
    end

    assert_mock mock
  end
end
