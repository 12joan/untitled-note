require "test_helper"

class AliasTest < ActiveSupport::TestCase
  test 'can be blank if title' do
    assert_predicate create(:alias, text: '', title: true), :persisted?
  end

  test 'cannot be blank if not title' do
    assert_raises(ActiveRecord::RecordInvalid) { create(:alias, text: '', title: false) }
  end
end
