require 'test_helper'

class S3FilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @owner = create(:user)
    @project = create(:project, owner: @owner)
    @s3_file = create(:s3_file, owner: @owner, original_project: @project)
    as_user(@owner)
  end

  test 'create returns post object when upload is allowed' do
    stub_allowed(true) do
      post = Struct.new(:url, :fields).new('some url', 'some fields')

      S3File.stub_any_instance(:presigned_post, post) do
        S3File.stub_any_instance(:url, 'some url') do
          assert_difference('S3File.count') do
            post api_v1_s3_files_url, params: {
              role: 'project-image',
              filename: 'image.png',
              size: 150 * 1024,
              content_type: 'image/png',
              project_id: @project.id,
            }
          end
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
        post api_v1_s3_files_url, params: {
          role: 'project-image',
          filename: 'image.png',
          size: 150 * 1024,
          content_type: 'image/png',
          project_id: @project.id,
        }
      end
    end

    assert_response :unprocessable_entity
    assert_equal 'Some error', JSON.parse(response.body)['error']
  end

  test 'show' do
    S3File.stub_any_instance(:url, 'some url') do
      get api_v1_s3_file_url(@s3_file)
    end

    assert_response :success
    assert_equal @s3_file.id, JSON.parse(response.body)['id'], 'should return file id'
  end

  private

  def stub_allowed(allowed, error = nil, &block)
    UploadAllowed.stub(:allowed?, allowed ? true : [false, error], &block)
  end
end
