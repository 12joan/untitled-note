require 'test_helper'

class DocumentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @document = create(:document)
    @project = @document.project
  end

  test 'should get index' do
    get api_v1_project_documents_url(@project)
    assert_response :success
  end

  test 'should create document' do
    assert_difference('Document.count') do
      assert_difference('Keyword.count', 2) do
        post api_v1_project_documents_url(@project), params: {
          document: {
            title: 'New title',
            body: '<div>Hello world</div>',
            keywords_attributes: [
              { text: 'Hello' },
              { text: 'World' },
            ],
          },
        }
      end
    end

    assert_response :success
    assert_equal 'New title', Document.last.title
  end

  test 'should show document' do
    get api_v1_project_document_url(@project, @document)
    assert_response :success
  end

  test 'should update document' do
    existing_keyword = create(:keyword, project: @project)

    assert_difference('Keyword.count', 1) do
      patch api_v1_project_document_url(@project, @document), params: {
        document: {
          title: 'New title',
          body: '<div>Hello world</div>',
          keywords_attributes: [
            { text: 'Hello' },
            { text: existing_keyword.text },
          ],
        },
      }
    end

    assert_response :success
    assert_equal 'New title', Document.find(@document.id).title
  end

  test 'should destroy document' do
    assert_difference('Document.count', -1) do
      delete api_v1_project_document_url(@project, @document)
    end

    assert_response :success
  end
end
