require 'test_helper'

class ProjectsAPITest < APITestCase
  setup do
    @user = create(:user)

    @projects = [].tap do |projects|
      projects << create(:project, owner: @user)
      projects << create(:project, owner: @user)
      projects << create(:project, owner: @user)
    end

    @index_params = {
      query: { id: true },
    }
  end

  test 'ProjectsAPI#index respects query' do
    assert_equal \
      [@projects.first, @projects.second, @projects.third].map { ({ id: _1.id }) },
      index_result
  end

  private

  def index_result
    ProjectsAPI.new(user: @user, params: @index_params).index
  end
end
