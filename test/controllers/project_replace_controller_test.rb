require 'test_helper'

class ProjectReplaceControllerTest < ActionDispatch::IntegrationTest
  include SlateJSONHelper

  setup do
    @project = create(:project)

    @documents = 3.times.map do |i|
      create(
        :document,
        project: @project,
        body: create_document_body { p { text "Document #{i} containing foo" } },
        body_type: 'json/slate',
      )
    end

    as_user(@project.owner)
  end

  test 'calls ReplaceInDocument.perform for each document' do
    mock = Minitest::Mock.new

    @documents.each do |document|
      mock.expect :perform, nil, document: document, find: 'foo', replace: 'bar'
    end

    Object.stub_const :ReplaceInDocument, mock do
      post api_v1_project_replace_url(@project), params: {
        find: 'foo',
        replace: 'bar',
      }
    end

    assert_mock mock
    assert_response :ok
  end
end
