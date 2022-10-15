require 'test_helper'

class S3FileTest < ActiveSupport::TestCase
  setup do
    @s3_file = build(:s3_file)
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
    @s3_file.uploaded_cache = true
    @s3_file.save!

    mock_s3_objects do |s3_object|
      s3_object.expect(:delete, nil)
      @s3_file.destroy
      s3_object.verify
    end
  end

  test 'when not uploaded, on destroy, do not delete from S3' do
    @s3_file.uploaded_cache = false
    @s3_file.save!

    mock_s3_objects do |s3_object|
      s3_object.expect(:exists?, false)
      @s3_file.destroy
      s3_object.verify
    end
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
