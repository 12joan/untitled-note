require 'test_helper'

class DocumentMarkdownControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = create(:project)
    @document = create(
      :document,
      project: @project,
      body: <<~HTML
        <div>
          <h1>Heading 1</h1>
          <p>This is a paragraph with some <strong>bold text</strong> and some <i>italic text</i>.</p>
          <blockquote>This is a blockquote</blockquote>
          <marquee>This tag is not supported by markdown</marquee>
        </div>
      HTML
    )
  end

  test 'should get show' do
    get api_v1_project_document_markdown_url(@project, @document)
    assert_response :success
  end
end
