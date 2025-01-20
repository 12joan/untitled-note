require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  test 'image_url is nil when image is nil' do
    assert_nil create(:project, image: nil).image_url
  end

  test 'image_url is present when image is present' do
    project = create(:project)
    image = create(:s3_file, owner: project.owner, original_project: project)
    project.update!(image: image)

    S3File.stub_any_instance(:url, 'http://example.com/image.png') do
      assert_equal 'http://example.com/image.png', project.image_url
    end
  end

  test 'image becomes null when image is destroyed' do
    project = create(:project)
    image = create(:s3_file, owner: project.owner, original_project: project)
    project.update!(image: image)

    ignore_s3 do
      image.destroy!
    end

    assert_nil project.reload.image
  end

  test 'can delete project with tags' do
    project = create(:project)
    tags = create_list(:tag, 1, project: project)
    create(:document, project: project, tags: tags)
    project.destroy!
    assert_predicate project, :destroyed?
  end

  test 'new project has order_string 8 if no other projects exist' do
    owner = create(:user)
    project = create(:project, owner: owner)
    assert_equal '8', project.order_string
  end

  test 'new project has a maximal order_string if other projects exist' do
    owner = create(:user)
    create(:project, owner: owner, order_string: 'f5')
    create(:project, owner: owner, order_string: 'f3')
    create(:project, owner: owner, order_string: 'fe')
    create(:project, owner: owner, order_string: 'f4')
    project_1 = create(:project, owner: owner)
    assert_equal 'ff', project_1.order_string
    project_2 = create(:project, owner: owner)
    assert_equal 'ff1', project_2.order_string
  end

  test 'order_string cannot end in a zero' do
    project = build(:project, order_string: '8')
    assert_predicate project, :valid?
    project.order_string = '80'
    refute_predicate project, :valid?
  end
end
