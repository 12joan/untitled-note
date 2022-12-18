require 'test_helper'

class BlankDocumentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = create(:project)
    as_user(@project.owner)
  end

  test 'creates a blank document when no tag is provided' do
    assert_difference('Document.count', 1) do
      post api_v1_project_blank_document_url(@project)
    end

    assert_response :success

    document = response_document
    assert_predicate document, :blank?
    assert_empty document.tags
  end

  test 'when a tag is provided, creates a blank document with that tag' do
    tag = create(:tag, project: @project)
    post api_v1_project_blank_document_url(@project), params: { tag_id: tag.id }

    assert_response :success

    document = response_document
    assert_predicate document, :blank?
    assert_equal [tag], document.tags
  end

  private

  def response_document = Document.find(JSON.parse(response.body).fetch('id'))
end
