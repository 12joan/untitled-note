require 'test_helper'

class ProjectFoldersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @project_folder = create(:project_folder, owner: @user)
    as_user(@user)
  end

  test 'should create project folder' do
    assert_difference('ProjectFolder.count') do
      post api_v1_project_folders_url, params: {
        project_folder: { name: 'New folder' }
      }
    end

    assert_response :success

    project_folder = ProjectFolder.last
    assert_equal 'New folder', project_folder.name
  end

  test 'should update project folder' do
    patch api_v1_project_folder_url(@project_folder), params: {
      project_folder: { name: 'New name' }
    }

    assert_response :success

    @project_folder.reload
    assert_equal 'New name', @project_folder.name
  end

  test 'should destroy project folder' do
    assert_difference('ProjectFolder.count', -1) do
      delete api_v1_project_folder_url(@project_folder)
    end

    assert_response :success
  end
end
