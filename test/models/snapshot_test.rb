require 'test_helper'

class SnapshotTest < ActiveSupport::TestCase
  setup do
    @snapshot = create(:snapshot)
  end

  test 'valid snapshot' do
    assert_predicate @snapshot, :valid?
  end

  test 'invalid with empty document' do
    @snapshot.document = create(:document, body_type: 'empty')
    assert_predicate @snapshot, :invalid?
  end

  test 'invalid with a nested restores_snapshot' do
    @snapshot.restores_snapshot = create(:snapshot)
    assert_predicate @snapshot, :valid?

    @snapshot.restores_snapshot.restores_snapshot = create(:snapshot)
    assert_predicate @snapshot, :invalid?
  end
end
