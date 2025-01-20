require 'test_helper'

class TryCreateAutoSnapshotTest < ActiveSupport::TestCase
  test 'does nothing if auto snapshots are disabled' do
    assert_does_nothing create_document(
      auto_snapshots_option: 'disabled',
      created_at: 5.years.ago,
    )
  end

  test 'creates an automatic snapshot if no previous snapshot exists and document was created more than interval ago' do
    assert_creates_snapshot create_document(
      auto_snapshots_option: 'hourly',
      created_at: 2.hours.ago,
    )
  end

  test 'does nothing if no previous snapshot exists and document was created less than interval ago' do
    assert_does_nothing create_document(
      auto_snapshots_option: 'hourly',
      created_at: 58.minutes.ago,
    )
  end

  test 'creates an automatic snapshot if a previous snapshot exists and was created more than interval ago' do
    document = create_document(
      auto_snapshots_option: 'monthly',
      created_at: 2.months.ago,
    )

    create_snapshot(document, created_at: (1.month + 1.day).ago)

    assert_creates_snapshot document
  end

  test 'does nothing if a previous snapshot exists and was created less than interval ago' do
    document = create_document(
      auto_snapshots_option: 'monthly',
      created_at: 2.months.ago,
    )

    create_snapshot(document, created_at: (1.month - 1.day).ago)

    assert_does_nothing document
  end

  private

  def create_document(**params)
    merged_params = {
      body_type: 'json/slate',
      body: '{}',
    }.merge(params)

    create(:document, **merged_params)
  end

  def create_snapshot(document, **params)
    merged_params = {
      document: document,
      body: document.body,
      manual: false,
    }.merge(params)

    create(:snapshot, **merged_params)
  end

  def assert_does_nothing(document)
    assert_no_difference 'Snapshot.count' do
      TryCreateAutoSnapshot.perform(document)
    end
  end

  def assert_creates_snapshot(document)
    assert_difference 'Snapshot.count' do
      TryCreateAutoSnapshot.perform(document)
    end

    snapshot = Snapshot.last
    assert_equal document, snapshot.document
    assert_equal document.body, snapshot.body
    refute_predicate snapshot, :manual?
  end
end
