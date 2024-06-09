require 'test_helper'

class UploadAllowedTest < ActiveSupport::TestCase
  setup do
    @user = create(:user, storage_quota_override: 1 * 1024 * 1024, storage_used: 0)
  end

  test 'not allowed without valid role' do
    allowed, error = UploadAllowed.allowed?(
      user: @user,
      file_params: file_params(role: 'invalid-role'),
    )

    refute allowed, 'should not be allowed'
    assert_equal 'Invalid role', error
  end

  test 'project image is allowed' do
    allowed, error = UploadAllowed.allowed?(
      user: @user,
      file_params: project_image_params,
    )

    assert allowed, 'should be allowed'
  end

  test 'project image is not allowed if size is too large' do
    allowed, error = UploadAllowed.allowed?(
      user: @user,
      file_params: project_image_params(size: 500 * 1024),
    )

    refute allowed, 'should not be allowed'
    assert_equal 'File is too large', error
  end

  test 'project image is not allowed if content type is not image' do
    allowed, error = UploadAllowed.allowed?(
      user: @user,
      file_params: project_image_params(content_type: 'text/plain'),
    )

    refute allowed, 'should not be allowed'
    assert_equal 'File is not an image', error
  end

  test 'attachment is allowed' do
    allowed, error = UploadAllowed.allowed?(
      user: @user,
      file_params: attachment_params,
    )

    assert allowed, 'should be allowed'
  end

  test 'allowed if size is equal to remaining quota' do
    @user.update!(storage_used: @user.storage_quota - 54)

    allowed, error = UploadAllowed.allowed?(
      user: @user,
      file_params: project_image_params(size: 54),
    )

    assert allowed, 'should be allowed'
  end

  test 'not allowed if size is greater than remaining quota' do
    @user.update!(storage_used: @user.storage_quota - 54)

    allowed, error = UploadAllowed.allowed?(
      user: @user,
      file_params: project_image_params(size: 55),
    )

    refute allowed, 'should not be allowed'
    assert_equal 'Not enough storage space', error
  end

  private

  def file_params(overrides = {})
    {
      size: 150 * 1024,
      content_type: 'image/png',
    }.merge(overrides)
  end

  def project_image_params(overrides = {})
    file_params(
      role: 'project-image',
    ).merge(overrides)
  end

  def attachment_params(overrides = {})
    file_params(
      role: 'attachment',
    ).merge(overrides)
  end
end
