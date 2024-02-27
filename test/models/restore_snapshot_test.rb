require 'test_helper'

class RestoreSnapshotTest < ActiveSupport::TestCase
  include SlateJSONHelper

  setup do
    @current_body = create_document_body do
      p { text 'Hello, world!' }
    end

    @snapshot_body = create_document_body do
      p { text 'Goodbye, world!' }
    end

    @document = create(:document, body_type: 'json/slate', body: @current_body)
    @snapshot = create(:snapshot, document: @document, body: @snapshot_body)
  end

  test 'restores without saving current' do
    assert_no_difference 'Snapshot.count' do
      RestoreSnapshot.perform(snapshot: @snapshot, save_current: false)
    end

    assert_equal @snapshot_body, @document.reload.body
  end

  test 'restores and saves current' do
    assert_difference 'Snapshot.count', 1 do
      RestoreSnapshot.perform(snapshot: @snapshot, save_current: true)
    end

    assert_equal @snapshot_body, @document.reload.body

    new_snapshot = @document.snapshots.last
    assert_equal @current_body, new_snapshot.body
    assert_equal @snapshot, new_snapshot.before_restore_snapshot
  end
end
