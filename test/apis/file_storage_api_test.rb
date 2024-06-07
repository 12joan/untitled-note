require 'test_helper'

class FileStorageAPITest < APITestCase
  setup do
    @user = create(:user, storage_quota_override: 200, storage_used: 0)
    @project = create(:project, owner: @user)
    create_list(:s3_file, 3, owner: @user, original_project: @project, size: 50)
  end

  test 'FileStorage#quota_usage returns used and total quota' do
    result = api.quota_usage
    assert_equal 150, result[:used]
    assert_equal 200, result[:quota]
  end

  test 'FileStorage#quota_usage reloads user' do
    @user.storage_quota_override = 300
    result = api.quota_usage
    assert_equal 200, result[:quota]
  end

  test 'FileStorage#files returns all files' do
    S3File.stub_any_instance(:url, 'some url') do
      result = api.files
      assert_equal 3, result.size
    end
  end

  private

  def api
    FileStorageAPI.new(user: @user, params: {})
  end
end
