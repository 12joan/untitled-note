require 'test_helper'

class DocumentReplaceControllerTest < ActionDispatch::IntegrationTest
  include SlateJSONHelper

  setup do
    @project = create(:project)

    @document = create(
      :document,
      project: @project,
      body: create_document_body { p { text 'Document containing foo' } },
      plain_body: 'Document containing foo',
      body_type: 'json/slate',
    )

    as_user(@project.owner)
  end

  test 'calls ReplaceInDocument.perform' do
    mock = Minitest::Mock.new
    mock.expect :perform, 13, document: @document, find: 'foo', replace: 'bar'

    Object.stub_const :ReplaceInDocument, mock do
      post api_v1_project_document_replace_url(@project, @document), params: {
        find: 'foo',
        replace: 'bar',
      }
    end

    assert_mock mock
    assert_response :ok

    parsed_response = JSON.parse(response.body)
    assert_equal 13, parsed_response['occurrences']
    assert_equal 1, parsed_response['documents']
  end
end
