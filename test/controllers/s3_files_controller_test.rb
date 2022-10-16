require 'test_helper'

class S3FilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @s3_file = create(:s3_file)
    @project = @s3_file.project
    as_user(@project.owner)
  end

  test 'create returns post object when upload is allowed' do
    stub_allowed(true) do
      post = Struct.new(:url, :fields).new('some url', 'some fields')

      S3File.stub_any_instance(:presigned_post, post) do
        assert_difference('S3File.count') do
          post api_v1_project_s3_files_url(@project), params: {
            role: 'project-image',
            filename: 'image.png',
            size: 150 * 1024,
            content_type: 'image/png',
          }
        end
      end
    end

    assert_response :success

    parsed_response = JSON.parse(response.body)
    assert_equal S3File.last.id, parsed_response['id'], 'should return file id'
    assert_equal 'some url', parsed_response['presigned_post']['url'], 'should return presigned post url'
    assert_equal 'some fields', parsed_response['presigned_post']['fields'], 'should return presigned post fields'
  end

  test 'create returns error when upload is not allowed' do
    stub_allowed(false, 'Some error') do
      assert_no_difference('S3File.count') do
        post api_v1_project_s3_files_url(@project), params: {
          role: 'project-image',
          filename: 'image.png',
          size: 150 * 1024,
          content_type: 'image/png',
        }
      end
    end

    assert_response :unprocessable_entity
    assert_equal 'Some error', JSON.parse(response.body)['error']
  end

  test 'show' do
    get api_v1_project_s3_file_url(@project, @s3_file)
    assert_response :success
    assert_equal @s3_file.id, JSON.parse(response.body)['id'], 'should return file id'
  end

  private

  def stub_allowed(allowed, error = nil, &block)
    UploadAllowed.stub(:allowed?, allowed ? true : [false, error], &block)
  end
end
