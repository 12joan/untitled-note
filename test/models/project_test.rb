require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  test 'image_url is nil when image is nil' do
    assert_nil create(:project, image: nil).image_url
  end

  test 'image_url is present when image is present' do
    project = create(:project)
    image = create(:s3_file, project: project)
    project.update!(image: image)

    S3File.stub_any_instance(:url, 'http://example.com/image.png') do
      assert_equal 'http://example.com/image.png', project.image_url
    end
  end

  test 'image becomes null when image is destroyed' do
    project = create(:project)
    image = create(:s3_file, project: project)
    project.update!(image: image)

    ignore_s3 do
      image.destroy!
    end

    assert_nil project.reload.image
  end
end
