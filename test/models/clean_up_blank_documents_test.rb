require 'test_helper'

class CleanUpBlankDocumentsTest < ActiveSupport::TestCase
  test 'non-blank documents are not deleted' do
    5.times { create(:document, blank: false, created_at: 25.hours.ago) }

    assert_no_difference('Document.count') do
      CleanUpBlankDocuments.perform
    end
  end

  test 'blank documents younger than 24 hours are not deleted' do
    5.times { create(:document, blank: true, created_at: 23.hours.ago) }

    assert_no_difference('Document.count') do
      CleanUpBlankDocuments.perform
    end
  end

  test 'blank documents older than 24 hours are deleted except the most recent per user' do
    alice = create(:user)
    alice_project = create(:project, owner: alice)
    4.times { create(:document, blank: true, project: alice_project, created_at: 26.hours.ago) }
    alice_most_recent = create(:document, blank: true, project: alice_project, created_at: 25.hours.ago)

    bob = create(:user)
    bob_project = create(:project, owner: bob)
    4.times { create(:document, blank: true, project: bob_project, created_at: 26.hours.ago) }
    bob_most_recent = create(:document, blank: true, project: bob_project, created_at: 25.hours.ago)

    assert_difference('Document.count', -8) do
      CleanUpBlankDocuments.perform
    end

    assert_equal [alice_most_recent], alice.documents
    assert_equal [bob_most_recent], bob.documents
  end
end
