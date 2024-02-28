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
    assert_difference 'Snapshot.count', 1 do
      RestoreSnapshot.perform(snapshot: @snapshot, save_current: false)
    end

    assert_equal @snapshot_body, @document.reload.body

    restore_snapshot = @document.snapshots.last
    assert_equal @snapshot_body, restore_snapshot.body
    assert_predicate restore_snapshot, :manual?
    assert_equal @snapshot, restore_snapshot.restores_snapshot
  end

  test 'restores and saves current' do
    assert_difference 'Snapshot.count', 2 do
      RestoreSnapshot.perform(snapshot: @snapshot, save_current: true)
    end

    assert_equal @snapshot_body, @document.reload.body

    save_current_snapshot, restore_snapshot = @document.snapshots.last(2)

    assert_equal @current_body, save_current_snapshot.body
    refute_predicate save_current_snapshot, :manual?
    assert_nil save_current_snapshot.restores_snapshot

    assert_equal @snapshot_body, restore_snapshot.body
    assert_predicate restore_snapshot, :manual?
    assert_equal @snapshot, restore_snapshot.restores_snapshot
  end

  test 'restore from restore snapshot' do
    assert_difference 'Snapshot.count', 1 do
      RestoreSnapshot.perform(snapshot: @snapshot, save_current: false)
    end

    restore_snapshot = @document.snapshots.last

    assert_difference 'Snapshot.count', 1 do
      RestoreSnapshot.perform(snapshot: restore_snapshot, save_current: false)
    end

    double_restore_snapshot = @document.snapshots.last

    assert_equal @snapshot_body, @document.reload.body
    assert_equal @snapshot_body, double_restore_snapshot.body
    assert_equal @snapshot, double_restore_snapshot.restores_snapshot
  end
end
