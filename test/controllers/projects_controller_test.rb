require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @project_folder = create(:project_folder, owner: @user)
    @project = create(:project, owner: @user)
    @project_with_folder = create(:project, owner: @user, folder: @project_folder)
    as_user(@user)
  end

  test 'should create project without folder' do
    assert_difference('Project.count') do
      post api_v1_projects_url, params: { project: { name: 'New project' } }
    end

    assert_response :success

    project = Project.last
    assert_equal 'New project', project.name
    assert_nil project.folder
  end

  test 'should create project with folder' do
    assert_difference('Project.count') do
      post api_v1_projects_url, params: {
        project: { name: 'New project', folder_id: @project_folder.id }
      }
    end

    assert_response :success

    project = Project.last
    assert_equal 'New project', project.name
    assert_equal @project_folder, project.folder
  end

  test 'should update project' do
    patch api_v1_project_url(@project), params: {
      project: {
        name: 'New name',
        emoji: '👍',
        background_colour: 'light',
      }
    }

    assert_response :success

    @project.reload
    assert_equal 'New name', @project.name
    assert_equal '👍', @project.emoji
    assert_equal 'light', @project.background_colour
  end

  test 'should update project to add folder' do
    patch api_v1_project_url(@project), params: {
      project: { folder_id: @project_folder.id }
    }

    assert_response :success

    @project.reload
    assert_equal @project_folder, @project.folder
  end

  test 'should update project to remove folder' do
    patch api_v1_project_url(@project_with_folder), params: {
      project: { folder_id: nil }
    }

    assert_response :success

    @project_with_folder.reload
    assert_nil @project_with_folder.folder
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
    initial_name = @project.name
    patch api_v1_project_url(@project), params: { project: { name: 'New name' } }
    assert_response :not_found
    @project.reload
    assert_equal initial_name, @project.name
  end
end
