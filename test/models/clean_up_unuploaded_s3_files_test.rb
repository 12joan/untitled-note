require 'test_helper'

class CleanUpUnuploadedS3FilesTest < ActiveSupport::TestCase
  test 'uploaded files should not be deleted' do
    s3_file1 = create(:s3_file, uploaded_cache: false, created_at: 2.hours.ago)
    s3_file2 = create(:s3_file, uploaded_cache: false, created_at: 2.hours.ago)

    stub_uploaded(true) do
      CleanUpUnuploadedS3Files.perform
    end

    assert S3File.exists?(s3_file1.id), 's3_file1 should exist'
    assert S3File.exists?(s3_file2.id), 's3_file2 should exist'
  end

  test 'unuploaded files less than 1 hour old should not be deleted' do
    s3_file1 = create(:s3_file, uploaded_cache: false, created_at: 59.minutes.ago)
    s3_file2 = create(:s3_file, uploaded_cache: false, created_at: 59.minutes.ago)

    stub_uploaded(false) do
      CleanUpUnuploadedS3Files.perform
    end

    assert S3File.exists?(s3_file1.id), 's3_file1 should exist'
    assert S3File.exists?(s3_file2.id), 's3_file2 should exist'
  end

  test 'unuploaded files more than 1 hour old should be deleted' do
    s3_file1 = create(:s3_file, uploaded_cache: false, created_at: 61.minutes.ago)
    s3_file2 = create(:s3_file, uploaded_cache: false, created_at: 61.minutes.ago)

    stub_uploaded(false) do
      CleanUpUnuploadedS3Files.perform
    end

    refute S3File.exists?(s3_file1.id), 's3_file1 should not exist'
    refute S3File.exists?(s3_file2.id), 's3_file2 should not exist'
  end

  private

  def stub_uploaded(uploaded, &block)
    S3File.stub_any_instance(:uploaded?, uploaded, &block)
  end
end
