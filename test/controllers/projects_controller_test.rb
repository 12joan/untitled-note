require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = create(:project)
    as_user(@project.owner)
  end

  test 'should create project' do
    assert_difference('Project.count') do
      post api_v1_projects_url, params: { project: { name: 'New project' } }
    end

    assert_response :success
  end

  test 'should update project' do
    patch api_v1_project_url(@project), params: {
      project: {
        name: 'New name',
        emoji: '👍',
        background_colour: 'light',
        archived_at: DateTime.now,
      }
    }

    assert_response :success

    @project.reload
    assert_equal 'New name', @project.name
    assert_equal '👍', @project.emoji
    assert_equal 'light', @project.background_colour
    assert_predicate @project.archived_at, :present?
  end

  test 'should destroy project' do
    assert_difference('Project.count', -1) do
      delete api_v1_project_url(@project)
    end

    assert_response :success
  end

  test 'cannot update project belonging to other user' do
    as_user(create(:user))

    assert_raises(ActiveRecord::RecordNotFound) do
      patch api_v1_project_url(@project), params: { project: { name: 'New name' } }
    end
  end
end
