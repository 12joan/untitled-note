require 'test_helper'

class DocumentsTagTest < ActiveSupport::TestCase
  test 'tag is not destroyed when tag has other documents' do
    tag = create(:tag)
    document1 = create(:document, tags: [tag])
    document2 = create(:document, tags: [tag])

    assert_equal 1, document1.tags.count, 'document1 should have 1 tag'
    assert_equal 1, document2.tags.count, 'document2 should have 1 tag'
    assert_equal 2, tag.documents.count, 'tag should have 2 documents'

    assert_no_difference('Tag.count') do
      document1.tags.destroy_all
    end
  end

  test 'tag is destroyed when tag has no remaining documents' do
    tag = create(:tag)
    document = create(:document, tags: [tag])

    assert_equal 1, document.tags.count, 'document should have 1 tag'
    assert_equal 1, tag.documents.count, 'tag should have 1 document'

    assert_difference('Tag.count', -1) do
      document.tags.destroy_all
    end
  end

  test 'destroying a tag never destroys a document' do
    tag = create(:tag)
    document = create(:document, tags: [tag])

    assert_equal 1, document.tags.count, 'document should have 1 tag'
    assert_equal 1, tag.documents.count, 'tag should have 1 document'

    assert_no_difference('Document.count') do
      tag.destroy
    end
  end
end
