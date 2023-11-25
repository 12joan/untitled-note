require 'test_helper'

class SlateUtilsTest < ActiveSupport::TestCase
  include SlateJSONHelper

  test 'SlateNode parses and serializes document bodies' do
    original_json = create_document_body do
      p do
        text 'Hello, world!', bold: true
      end

      blockquote do
        p do
          text 'This is a blockquote'
        end
      end
    end

    expected_json = create_document_body do
      p do
        text 'Goodbye, world!', bold: true
      end

      blockquote do
        p do
          text 'This is a blockquote'
        end
      end
    end

    slate_nodes = SlateUtils::SlateNode.parse(original_json)
    slate_nodes[0].children[0].text = 'Goodbye, world!'
    slate_nodes_json = slate_nodes.to_json

    assert_equal JSON.parse(expected_json), JSON.parse(slate_nodes_json)
  end

  test 'traverses document bodies' do
    json = create_document_body do
      p do
        text 'Hello, world!', bold: true
      end

      blockquote do
        p do
          text 'This is a blockquote'
        end
      end
    end

    slate_nodes = SlateUtils::SlateNode.parse(json)

    nodes = []

    slate_nodes.traverse do |node|
      nodes << node
    end

    first_paragraph = nodes[0]
    first_text = nodes[1]
    blockquote = nodes[2]
    second_paragraph = nodes[3]
    second_text = nodes[4]

    assert_equal 'p', first_paragraph.type
    assert_equal 'Hello, world!', first_text.text
    assert first_text.attributes[:bold], 'first_text should be bold'
    assert_equal 'blockquote', blockquote.type
    assert_equal 'p', second_paragraph.type
    assert_equal 'This is a blockquote', second_text.text
    assert_nil second_text.attributes[:bold], 'second_text should not be bold'
  end
end
