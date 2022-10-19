require 'test_helper'

class SearchControllerTest < ActionDispatch::IntegrationTest
  setup do
    @document = create(:document, title: 'My document', plain_body: 'This is a test document')
    @project = @document.project
    as_user(@project.owner)
  end

  test 'searches project for documents matching query' do
    get api_v1_project_search_path(@project, q: 'test')
    assert_response :success

    parsed_response = JSON.parse(response.body)
    assert_predicate parsed_response.dig(0, 'document', 'id'), :present?, 'response should include document id'
    assert_predicate parsed_response.dig(0, 'highlights', 0, 'snippet'), :present?, 'response should include highlights'
  end
end
