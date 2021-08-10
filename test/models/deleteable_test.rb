module DeleteableTest
  def deleteable_tests(model_klass:, factory:)
    test 'model with no deleted_at is not deleted' do
      refute_predicate build(factory, deleted_at: nil), :deleted?
    end

    test 'model with any non-nil deleted_at date is deleted' do
      assert_predicate build(factory, deleted_at: 5.hours.from_now), :deleted?
    end

    test 'deleted scope contains all deleted records' do
      record1 = create(factory, deleted_at: 5.hours.from_now)
      record2 = create(factory, deleted_at: 2.hours.ago)
      record3 = create(factory, deleted_at: nil)
      record4 = create(factory, deleted_at: DateTime.now)

      assert_equal [record1, record2, record4], model_klass.deleted
    end

    test 'not_deleted scope contains all records that are not deleted' do
      record1 = create(factory, deleted_at: 5.hours.from_now)
      record2 = create(factory, deleted_at: 2.hours.ago)
      record3 = create(factory, deleted_at: nil)
      record4 = create(factory, deleted_at: DateTime.now)

      assert_equal [record3], model_klass.not_deleted
    end

    test 'mark_for_soft_deletion sets the deleted_at for a record without modifying the database' do
      record = create(factory, deleted_at: nil)

      freeze_time do
        record.mark_for_soft_deletion
        assert_equal DateTime.now, record.deleted_at
      end

      record.reload

      assert_nil record.deleted_at
    end

    test 'soft_delete sets the deleted_at for a record immediately' do
      record = create(factory, deleted_at: nil)

      freeze_time do
        record.soft_delete
        record.reload
        assert_equal DateTime.now, record.deleted_at
      end
    end
  end
end
