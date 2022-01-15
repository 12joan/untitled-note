require 'test_helper'

class DocumentMarkdownControllerTest < ActionDispatch::IntegrationTest
  test 'can handle many types of tag' do
    document = create(:document, body: <<~HTML)
      <div>
        <h1>Heading 1</h1>
        <p>This is a paragraph with some <strong>bold text</strong> and some <i>italic text</i>.</p>
        <blockquote>This is a blockquote</blockquote>
        <marquee>This tag is not supported by markdown</marquee>
      </div>
    HTML

    get api_v1_project_document_markdown_url(document.project, document)
    assert_response :success

    assert_equal <<~MARKDOWN.strip, response.body.strip
      ## Heading 1

      This is a paragraph with some **bold text** and some _italic text_.

      > This is a blockquote

      This tag is not supported by markdown
     MARKDOWN
  end
end
