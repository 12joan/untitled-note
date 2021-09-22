require 'test_helper'

class DocumentsAPITest < APITestCase
  setup do
    @project = create(:project)
    @documents = 3.times.map { create(:document, project: @project) }

    @params = {
      project_id: @project.id,
      query: :all,
    }
  end

  test 'DocumentsAPI#index respects query' do
    @params.merge!(query: { id: true })
    assert_equal @documents.map { ({ id: _1.id }) }, documents_api.index
  end

  private

  def documents_api
    DocumentsAPI.new(@params)
  end
end
