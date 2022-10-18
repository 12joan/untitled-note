require 'test_helper'

class ProjectOrderControllerTest < ActionDispatch::IntegrationTest
  test 'update project order' do
    user = create(:user)
    as_user(user)

    p1, p2, p3, p4, p5 = create_list(:project, 5, owner: user)

    patch api_v1_project_order_url, params: {
      order: [p4, p2, p5, p1, p3].map(&:id),
    }

    assert_response :success

    assert_equal [4, 2, 5, 1, 3], user.projects.order(:id).pluck(:list_index)
  end
end
