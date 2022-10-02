require 'test_helper'

class TagsAPITest < APITestCase
  setup do
    @project = create(:project)
    @user = @project.owner

    @tags = [].tap do |tags|
      tags << create(:tag, project: @project)
      tags << create(:tag, project: @project)
      tags << create(:tag, project: @project)
    end

    @index_params = {
      project_id: @project.id,
      query: { id: true },
    }
  end

  test 'TagsAPI#index respects query' do
    assert_equal \
      [@tags.first, @tags.second, @tags.third].map { ({ id: _1.id }) },
      index_result
  end

  private

  def index_result
    TagsAPI.new(user: @user, params: @index_params).index
  end
end
