require 'test_helper'

class ProjectReplaceControllerTest < ActionDispatch::IntegrationTest
  include SlateJSONHelper

  setup do
    @project = create(:project)

    @documents_containing_foo = 3.times.map do |i|
      create(
        :document,
        project: @project,
        body: create_document_body { p { text "Document #{i} containing foo" } },
        plain_body: "Document #{i} containing foo",
        body_type: 'json/slate',
      )
    end

    @documents_not_containing_foo = 3.times.map do |i|
      create(
        :document,
        project: @project,
        body: create_document_body { p { text "Document #{i} not containing that word" } },
        plain_body: "Document #{i} not containing that word",
        body_type: 'json/slate',
      )
    end

    as_user(@project.owner)
  end

  test 'calls ReplaceInDocument.perform for each document containing term' do
    mock = Minitest::Mock.new

    @documents_containing_foo.each_with_index do |document, index|
      mock.expect :perform, index + 1, document: document, find: 'foo', replace: 'bar'
    end

    Object.stub_const :ReplaceInDocument, mock do
      post api_v1_project_replace_url(@project), params: {
        find: 'foo',
        replace: 'bar',
      }
    end

    assert_mock mock
    assert_response :ok

    parsed_response = JSON.parse(response.body)
    assert_equal 1 + 2 + 3, parsed_response['occurrences']
    assert_equal 3, parsed_response['documents']
  end
end
