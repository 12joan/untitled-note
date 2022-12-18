require 'test_helper'

class CleanUpBlankDocumentsTest < ActiveSupport::TestCase
  test 'non-blank documents are not deleted' do
    create(:document, blank: false, created_at: 25.hours.ago)

    assert_no_difference('Document.count') do
      CleanUpBlankDocuments.perform
    end
  end

  test 'blank documents older than 24 hours are deleted' do
    create(:document, blank: true, created_at: 25.hours.ago)

    assert_difference('Document.count', -1) do
      CleanUpBlankDocuments.perform
    end
  end

  test 'blank documents younger than 24 hours are not deleted' do
    create(:document, blank: true, created_at: 23.hours.ago)

    assert_no_difference('Document.count') do
      CleanUpBlankDocuments.perform
    end
  end
end
