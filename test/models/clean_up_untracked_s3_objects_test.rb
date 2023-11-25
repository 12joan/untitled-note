require 'test_helper'

class CleanUpUntrackedS3ObjectsTest < ActiveSupport::TestCase
  test 'deletes untracked S3 objects' do
    objects = [
      mock_object('my-untracked-file-1'),
      mock_object('my-untracked-file-2'),
      mock_object('my-untracked-file-3'),
    ]

    objects.each do |mock|
      mock.expect(:delete, nil)
    end

    stub_objects(objects) do
      CleanUpUntrackedS3Objects.perform
    end

    objects.each do |mock|
      assert_mock mock
    end
  end

  test 'does not delete tracked S3 objects' do
    s3_file = create(:s3_file)
    mock = mock_object(s3_file.s3_key)

    stub_objects([mock]) do
      CleanUpUntrackedS3Objects.perform
    end

    assert_mock mock
  end

  private

  def stub_objects(objects, &block)
    Rails.application.config.s3_bucket.stub(:objects, objects, &block)
  end

  def mock_object(key)
    mock = Minitest::Mock.new
    mock.expect(:key, key)
    mock
  end
end
