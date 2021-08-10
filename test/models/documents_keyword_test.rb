require 'test_helper'

class DocumentsKeywordTest < ActiveSupport::TestCase
  test 'keyword is not destroyed when keyword has other documents' do
    keyword = create(:keyword)
    document1 = create(:document, keywords: [keyword])
    document2 = create(:document, keywords: [keyword])

    assert_equal 1, document1.keywords.count, 'document1 should have 1 keyword'
    assert_equal 1, document2.keywords.count, 'document2 should have 1 keyword'
    assert_equal 2, keyword.documents.count, 'keyword should have 2 documents'

    assert_no_difference('Keyword.count') do
      document1.keywords.destroy_all
    end
  end

  test 'keyword is destroyed when keyword has no remaining documents' do
    keyword = create(:keyword)
    document = create(:document, keywords: [keyword])

    assert_equal 1, document.keywords.count, 'document should have 1 keyword'
    assert_equal 1, keyword.documents.count, 'keyword should have 1 document'

    assert_difference('Keyword.count', -1) do
      document.keywords.destroy_all
    end
  end

  test 'destroying a keyword never destroys a document' do
    keyword = create(:keyword)
    document = create(:document, keywords: [keyword])

    assert_equal 1, document.keywords.count, 'document should have 1 keyword'
    assert_equal 1, keyword.documents.count, 'keyword should have 1 document'

    assert_no_difference('Document.count') do
      keyword.documents.destroy_all
    end
  end
end
