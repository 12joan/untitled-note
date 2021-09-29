require 'test_helper'

class KeywordsAPITest < APITestCase
  setup do
    @project = create(:project)

    @keywords = [].tap do |keywords|
      keywords << create(:keyword, project: @project)
      keywords << create(:keyword, project: @project)
      keywords << create(:keyword, project: @project)
    end

    @index_params = {
      project_id: @project.id,
      query: { id: true },
    }
  end

  test 'KeywordsAPI#index respects query' do
    assert_equal \
      [@keywords.first, @keywords.second, @keywords.third].map { ({ id: _1.id }) },
      index_result
  end

  private

  def index_result
    KeywordsAPI.new(@index_params).index
  end
end
