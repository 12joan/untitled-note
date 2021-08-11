require 'test_helper'

class BlankDocumentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = create(:project)
  end

  test 'when no blank document exists should create a new blank document' do
    Document.where(blank: true).destroy_all

    assert_difference('Document.count', 1) do
      post api_v1_project_blank_document_url(@project)
    end

    assert_response :success

    document = Document.find(JSON.parse(response.body).fetch('id'))

    assert_predicate document, :blank?
  end

  test 'when a blank document exists should return it' do
    create(:document, project: @project, blank: true, title: 'Existing document')

    assert_no_difference('Document.count') do
      post api_v1_project_blank_document_url(@project)
    end

    assert_response :success

    document = Document.find(JSON.parse(response.body).fetch('id'))

    assert_predicate document, :blank?
    assert_equal 'Existing document', document.title
  end
end
