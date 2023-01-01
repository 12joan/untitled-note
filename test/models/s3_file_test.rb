require 'test_helper'

class S3FileTest < ActiveSupport::TestCase
  setup do
    @owner = create(:user)
    @project = create(:project, owner: @owner)
    @s3_file = create(:s3_file, project: @project)
  end

  test 'presigned_post calls S3 and returns post object' do
    mock_s3_objects do |s3_object|
      s3_object.expect(:presigned_post, 'some post object') { true }
      assert_equal 'some post object', @s3_file.presigned_post
      s3_object.verify
    end
  end

  test 'url calls S3 and returns presigned url' do
    mock_s3_objects do |s3_object|
      s3_object.expect(:presigned_url, 'some presigned url') { true }
      assert_equal 'some presigned url', @s3_file.url
      s3_object.verify
    end
  end

  test 'presigned url prevents inline display when content type is unsafe' do
    @s3_file.content_type = 'text/html'

    mock_s3_objects do |s3_object|
      s3_object.expect(:presigned_url, 'some presigned url') do |response_content_type:, response_content_disposition:, **_|
        response_content_type == 'application/octet-stream' && response_content_disposition.start_with?('attachment')
      end

      @s3_file.url

      s3_object.verify
    end
  end

  test 'presigned url allows inline display when content type is safe' do
    @s3_file.content_type = 'image/png'

    mock_s3_objects do |s3_object|
      s3_object.expect(:presigned_url, 'some presigned url') do |response_content_type:, response_content_disposition:, **_|
        response_content_type == 'image/png' && response_content_disposition.start_with?('inline')
      end

      @s3_file.url

      s3_object.verify
    end
  end

  test 'when uploaded_cache is false, uploaded? check with S3' do
    @s3_file.uploaded_cache = false

    mock_s3_objects do |s3_object|
      s3_object.expect(:exists?, true)
      assert @s3_file.uploaded?, 'uploaded? should be true'
      assert @s3_file.uploaded_cache?, 'uploaded_cache? should be true'
      s3_object.verify
    end
  end

  test 'when uploaded_cache is true, do not check with S3' do
    @s3_file.uploaded_cache = true
    assert @s3_file.uploaded?, 'uploaded? should be true'
  end

  test 'not_uploaded only calls S3 for files with uploaded_cache false' do
    @s3_file.delete

    s3_file1 = create(:s3_file, uploaded_cache: true)
    s3_file2 = create(:s3_file, uploaded_cache: false)
    s3_file3 = create(:s3_file, uploaded_cache: false)

    mock_s3_objects([s3_file2.s3_key, s3_file3.s3_key]) do |s3_object2, s3_object3|
      s3_object2.expect(:exists?, false)
      s3_object3.expect(:exists?, true)

      assert_equal [s3_file2], S3File.not_uploaded

      s3_object2.verify
      s3_object3.verify
    end
  end

  test 'when uploaded, on destroy, delete from S3' do
    @s3_file.update!(uploaded_cache: true)

    mock_s3_objects do |s3_object|
      s3_object.expect(:delete, nil)
      @s3_file.destroy
      s3_object.verify
    end
  end

  test 'when not uploaded, on destroy, do not delete from S3' do
    @s3_file.update!(uploaded_cache: false)

    mock_s3_objects do |s3_object|
      s3_object.expect(:exists?, false)
      @s3_file.destroy
      s3_object.verify
    end
  end

  test 'on create, increase owner storage_used' do
    @owner.update!(storage_used: 256)
    create(:s3_file, size: 100, project: @project)
    assert_equal 356, @owner.reload.storage_used
  end

  test 'on destroy, decrease owner storage_used' do
    @s3_file.update!(size: 100)
    @owner.update!(storage_used: 256)

    mock_s3_objects do |s3_object|
      s3_object.expect(:exists?, false)
      @s3_file.destroy
    end

    assert_equal 156, @owner.reload.storage_used
  end

  private

  def mock_s3_objects(expected_keys = [@s3_file.s3_key])
    s3_bucket = MiniTest::Mock.new
    s3_objects = expected_keys.map { MiniTest::Mock.new }

    expected_keys.zip(s3_objects).each do |key, s3_object|
      s3_bucket.expect(:object, s3_object, [key])
    end

    stub_s3_bucket(s3_bucket) do
      yield *s3_objects
    end

    s3_bucket.verify
  end
end
