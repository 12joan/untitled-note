require 'test_helper'

class ProjectImagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = create(:project, image: nil)
    @owner = @project.owner
    @old_image = create(:s3_file, owner: @owner, original_project: @project)
    @new_image = create(:s3_file, owner: @owner, original_project: @project)
    as_user(@owner)
  end

  test 'when old image is absent and new image is present' do
    put api_v1_project_image_url(@project), params: { image_id: @new_image.id }

    assert_response :success
    assert_equal @new_image, @project.reload.image
  end

  test 'when old image is present and new image is present' do
    @project.update!(image: @old_image)

    ignore_s3 do
      put api_v1_project_image_url(@project), params: { image_id: @new_image.id }
    end

    assert_response :success
    assert_equal @new_image, @project.reload.image
    assert_raises(ActiveRecord::RecordNotFound) { @old_image.reload }
  end

  test 'when old image is present and new image is absent' do
    @project.update!(image: @old_image)

    ignore_s3 do
      put api_v1_project_image_url(@project)
    end

    assert_response :success
    assert_nil @project.reload.image
    assert_raises(ActiveRecord::RecordNotFound) { @old_image.reload }
  end

  test 'when old image is absent and new image is absent' do
    put api_v1_project_image_url(@project)

    assert_response :success
    assert_nil @project.reload.image
  end
end
