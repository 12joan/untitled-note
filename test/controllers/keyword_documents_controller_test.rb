require 'test_helper'

class KeywordDocumentsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @project = create(:project)
    @keyword = create(:keyword, project: @project)
  end

  test 'should get index' do
    get api_v1_project_keyword_keyword_documents_url(@project, @keyword)
    assert_response :success
  end
end
