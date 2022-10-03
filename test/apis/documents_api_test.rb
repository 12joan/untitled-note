require 'test_helper'

class DocumentsAPITest < APITestCase
  setup do
    @project = create(:project)
    @user = @project.owner
    @tag = create(:tag, project: @project)

    @documents = [].tap do |documents|
      documents << create(:document, project: @project, updated_at: 3.days.ago, pinned_at: 1.hour.ago)
      documents << create(:document, project: @project, updated_at: 1.days.ago, tags: [@tag])
      documents << create(:document, project: @project, updated_at: 2.days.ago, tags: [@tag], pinned_at: 1.hour.ago)
      documents << create(:document, project: @project, updated_at: 2.days.ago, blank: true)
    end

    @index_params = {
      project_id: @project.id,
      query: { id: true },
      sort_by: 'created_at',
      sort_direction: 'asc',
    }

    @shown_document = @documents.first

    @show_params = {
      project_id: @project.id,
      id: @shown_document.id,
      query: { id: true },
    }
  end

  test 'DocumentsAPI#index respects query' do
    assert_equal \
      [@documents.first, @documents.second, @documents.third].map { ({ id: _1.id }) },
      index_result
  end

  test 'DocumentsAPI#index filters by tag_id if present' do
    @index_params.merge!(tag_id: @tag.id)

    assert_equal \
      [@documents.second, @documents.third].map(&:id),
      index_result.map { _1.fetch(:id) }
  end

  test 'DocumentsAPI#index applies sort_by and sort_direction if present' do
    @index_params.merge!(sort_by: 'updated_at', sort_direction: 'desc')

    assert_equal \
      [@documents.second, @documents.third, @documents.first].map(&:id),
      index_result.map { _1.fetch(:id) }
  end

  test 'DocumentsAPI#index excludes blank documents' do
    refute_includes \
      index_result.map { _1.fetch(:id) },
      @documents.fourth.id
  end

  test 'DocumentsAPI#index returns only pinned documents if pinned param is set' do
    @index_params.merge!(pinned: true)

    assert_equal \
      [@documents.first, @documents.third].map(&:id),
      index_result.map { _1.fetch(:id) }
  end

  test 'DocumentsAPI#index paginates results if per_page is present' do
    @index_params.merge!(per_page: 2)

    assert_equal \
      [@documents.first, @documents.second].map(&:id),
      index_result.map { _1.fetch(:id) }

    @index_params.merge!(page: 2, per_page: 2)

    assert_equal \
      [@documents.third].map(&:id),
      index_result.map { _1.fetch(:id) }
  end

  test 'DocumentsAPI#show respects query' do
    @show_params.merge!(query: { id: true, title: true })

    assert_equal \
      ({ id: @shown_document.id, title: @shown_document.title }),
      show_result
  end

  test 'DocumentsAPI#show does not show documents belonging to other users' do
    @user = create(:user)

    assert_raises(ActiveRecord::RecordNotFound) do
      show_result
    end
  end

  private

  def index_result
    DocumentsAPI.new(user: @user, params: @index_params).index
  end

  def show_result
    DocumentsAPI.new(user: @user, params: @show_params).show
  end
end
