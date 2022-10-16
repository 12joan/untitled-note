require 'test_helper'

class ProjectImagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = create(:project, image: nil)
    @old_image = create(:s3_file, project: @project)
    @new_image = create(:s3_file, project: @project)
    as_user(@project.owner)
  end

  test 'when old image is absent and new image is present' do
    put api_v1_project_image_url(@project), params: { image_id: @new_image.id }

    assert_response :success
    assert_equal @new_image, @project.reload.image
  end

  test 'when old image is present and new image is present' do
    @project.update!(image: @old_image)

    stub_s3 do
      put api_v1_project_image_url(@project), params: { image_id: @new_image.id }
    end

    assert_response :success
    assert_equal @new_image, @project.reload.image
    assert_raises(ActiveRecord::RecordNotFound) { @old_image.reload }
  end

  test 'when old image is present and new image is absent' do
    @project.update!(image: @old_image)

    stub_s3 do
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

  private

  def stub_s3
    s3_bucket = Class.new do
      def object(_)
        OpenStruct.new(delete: nil)
      end
    end.new

    stub_s3_bucket(s3_bucket) do
      yield
    end
  end
end
