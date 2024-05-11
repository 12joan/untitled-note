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

  test 'should batch update projects' do
    project1 = @project
    project2 = create(:project, owner: @project.owner)
    project3 = create(:project, owner: @project.owner)

    post api_v1_batch_update_projects_url, params: {
      projects: [
        { id: project1.id, name: 'Renamed project 1' },
        { id: project2.id, name: 'Renamed project 2' },
        { id: project3.id, name: 'Renamed project 3' },
      ]
    }

    assert_response :success

    project1.reload
    project2.reload
    project3.reload

    assert_equal 'Renamed project 1', project1.name
    assert_equal 'Renamed project 2', project2.name
    assert_equal 'Renamed project 3', project3.name
  end

  test 'should rollback batch update if one project fails' do
    project1 = @project
    project2 = create(:project, owner: @project.owner)
    project3 = create(:project, owner: @project.owner)

    post api_v1_batch_update_projects_url, params: {
      projects: [
        { id: project1.id, name: 'Renamed project 1' },
        { id: project2.id, name: 'Renamed project 2' },
        { id: project3.id, name: '' },
      ]
    }

    assert_response :unprocessable_entity

    project1.reload
    project2.reload
    project3.reload

    refute_equal 'Renamed project 1', project1.name
    refute_equal 'Renamed project 2', project2.name
    refute_equal '', project3.name
  end

  test 'should destroy project' do
    assert_difference('Project.count', -1) do
      delete api_v1_project_url(@project)
    end

    assert_response :success
  end

  test 'can destroy project with files' do
    create(:s3_file, original_project: @project)

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
