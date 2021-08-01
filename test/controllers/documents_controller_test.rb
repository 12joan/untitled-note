require 'test_helper'

class DocumentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @document = documents(:one)
  end

  test 'should get index' do
    get api_v1_documents_url
    assert_response :success
  end

  test 'should create document' do
    assert_difference('Document.count') do
      post api_v1_documents_url, params: { document: { body: '<div>Hello world</div>' } }
    end

    assert_response :success
  end

  test 'should show document' do
    get api_v1_document_url(@document)
    assert_response :success
  end

  test 'should update document' do
    patch api_v1_document_url(@document), params: { document: { body: '<div>Hello world</div>' } }
    assert_response :success
  end

  test 'should destroy document' do
    assert_difference('Document.count', -1) do
      delete api_v1_document_url(@document)
    end

    assert_response :success
  end
end
