require 'test_helper'

class KeywordsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @keyword = create(:keyword)
    @project = @keyword.project
  end

  test 'should get index' do
    get api_v1_project_keywords_url(@project)
    assert_response :success
  end

  test 'should create keyword' do
    new_keyword = build(:keyword)

    assert_difference('Keyword.count') do
      post api_v1_project_keywords_url(@project), params: { keyword: { text: new_keyword.text } }
    end

    assert_response :success
  end

  test 'should show keyword' do
    get api_v1_project_keyword_url(@project, @keyword)
    assert_response :success
  end

  test 'should update keyword' do
    patch api_v1_project_keyword_url(@project, @keyword), params: { keyword: { project_id: @keyword.project_id, text: @keyword.text } }
    assert_response :success
  end

  test 'should destroy keyword' do
    assert_difference('Keyword.count', -1) do
      delete api_v1_project_keyword_url(@project, @keyword)
    end

    assert_response :success
  end
end
