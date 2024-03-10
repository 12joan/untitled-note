require 'test_helper'

class ExtractPlainBodyTest < ActiveSupport::TestCase
  include SlateJSONHelper

  setup do
    @mentioned_document = create(:document, title: 'Mentioned Document')
    @project = @mentioned_document.project
  end

  test 'works for simple paragraph' do
    assert_extracts_plain_body('Hello, world!') do
      p { text 'Hello, world!' }
    end
  end

  test 'works for simple paragraph with bold' do
    assert_extracts_plain_body('Hello, world!') do
      p do
        text 'Hello, '
        text 'world', bold: true
        text '!'
      end
    end
  end

  test 'works for inline elements' do
    assert_extracts_plain_body('Hello,world!') do
      p do
        text 'Hello,'
        a href: 'http://example.com' do
          text 'world'
        end
        text '!'
      end
    end
  end

  test 'works for mentions' do
    id = @mentioned_document.id

    assert_extracts_plain_body('Hello,Mentioned Document!') do
      p do
        text 'Hello,'
        mention document_id: id, fallback_text: 'fallback' do
          text ''
        end
        text '!'
      end
    end
  end

  test 'works for mentions that do not exist' do
    id = @mentioned_document.id
    @mentioned_document.destroy!

    assert_extracts_plain_body('Hello, [Deleted document: fallback]!') do
      p do
        text 'Hello, '
        mention document_id: id, fallback_text: 'fallback' do
          text ''
        end
        text '!'
      end
    end
  end

  test 'works for multiple paragraphs' do
    assert_extracts_plain_body('Hello World') do
      p { text 'Hello' }
      p { text 'World' }
    end
  end

  test 'works for lists' do
    assert_extracts_plain_body('1 2 3 4 5') do
      ul do
        li { lic { text '1' } }
        li { lic { text '2' } }
        li do
          ol do
            li { lic { text '3' } }
            li { lic { text '4' } }
          end
        end
        li { lic { text '5' } }
      end
    end
  end

  test 'strips line breaks' do
    assert_extracts_plain_body('Hello World') do
      p { text "Hello\nWorld" }
    end
  end

  test 'works for attachments' do
    assert_extracts_plain_body('Hello World') do
      p { text 'Hello' }
      attachment s3_file_id: '123', filename: 'file.txt' do
        text ''
      end
      p { text 'World' }
    end
  end

  private

  def assert_extracts_plain_body(expected, &block)
    assert_equal(
      expected,
      ExtractPlainBody.perform(
        create_document_body(&block),
        project: @project
      )
    )
  end
end
