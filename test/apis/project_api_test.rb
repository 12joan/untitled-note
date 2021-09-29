require 'test_helper'

class ProjectAPITest < APITestCase
  setup do
    @projects = [].tap do |projects|
      projects << create(:project)
      projects << create(:project)
      projects << create(:project)
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
    ProjectsAPI.new(@index_params).index
  end
end
