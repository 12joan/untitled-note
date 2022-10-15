require 'test_helper'

class UploadAllowedTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
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
end
