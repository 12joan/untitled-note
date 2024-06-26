require 'test_helper'

class ReplaceInDocumentTest < ActiveSupport::TestCase
  include SlateJSONHelper

  test 'replaces text in simple cases' do
    assert_replaces 'TopLevelTextNode'
    assert_replaces 'TextInParagraph'
    assert_replaces 'TextInHeading'
  end

  test 'replaces in link text but not in url' do
    assert_replaces 'LinkText'
    refute_replaces 'TextInURL'
  end

  test 'replaces text in lists' do
    assert_replaces 'TextInList1'
    assert_replaces 'TextInList2'
    assert_replaces 'TextInNestedList'
  end

  test 'replaces text in plain body' do
    assert_replaces 'TextInPlainBody', in_plain_body: true
  end

  test 'replacement is case insensitive' do
    assert_replaces 'topleveltextnode'
  end

  test 'structure of document is preserved' do
    document = create_document
    old_body = document.body
    ReplaceInDocument.perform(document: document, find: 'NonMatchingText', replace: 'REPLACED')
    assert_equal old_body, document.reload.body
  end

  test 'capitalisation of surrounding text is preserved' do
    document = create_document
    ReplaceInDocument.perform(document: document, find: 'NEEDLE1', replace: 'REPLACED')
    assert_includes document.reload.body, 'REPLACED tExT wItH REPLACED sPeCiFiC cApItAlIsAtIoN REPLACED'
  end

  test 'replaces atomically' do
    document = create_document
    ReplaceInDocument.perform(document: document, find: 'NEEDLE2NEEDLE2', replace: 'REPLACED')
    assert_includes document.reload.body, '"REPLACEDREPLACED"'
  end

  test 'returns number of occurrences replaced' do
    count = ReplaceInDocument.perform(document: create_document, find: 'NEEDLE2', replace: 'REPLACED')
    assert_equal 4, count
  end

  test 'does not attempt to replace inside HTML documents' do
    document = create(:document, body: '<p>Text</p>', body_type: 'html/trix')
    ReplaceInDocument.perform(document: document, find: 'Text', replace: 'REPLACED')
    assert_equal '<p>Text</p>', document.reload.body
  end

  test 'refuses to process if find is blank' do
    document = create_document

    assert_raises(ArgumentError) do
      ReplaceInDocument.perform(document: document, find: '', replace: 'REPLACED')
    end
  end

  private

  def replaces?(text, in_plain_body: false)
    document = create_document
    ReplaceInDocument.perform(document: document, find: text, replace: 'REPLACED')

    if in_plain_body
      document.reload.plain_body.include?('REPLACED')
    else
      document.reload.body.include?('REPLACED')
    end
  end

  def assert_replaces(text, **options)
    assert replaces?(text, **options), "Expected #{text} to be replaced"
  end

  def refute_replaces(text, **options)
    refute replaces?(text, **options), "Expected #{text} not to be replaced"
  end

  def create_document
    create(
      :document,
      body: create_document_body do
        text 'TopLevelTextNode'

        p { text 'TextInParagraph' }

        h1 { text 'TextInHeading' }

        p do
          a(url: 'TextInURL') { text 'LinkText' }
        end

        ul do
          li { lic { text 'TextInList1' } }

          li do
            lic { text 'TextInList2' }

            ol do
              li { lic { text 'TextInNestedList' } }
            end
          end
        end

        p { text 'NEEDLE1 tExT wItH NEEDLE1 sPeCiFiC cApItAlIsAtIoN NEEDLE1' }
        p { text 'NEEDLE2NEEDLE2NEEDLE2NEEDLE2' }

        p { text 'This is required to make TextInPlainBody work' }
      end,
      plain_body: 'TextInPlainBody',
      body_type: 'json/slate',
    )
  end
end
