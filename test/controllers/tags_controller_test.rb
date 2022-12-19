require 'test_helper'

class TagsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tag = create(:tag, text: 'My Tag')
    @project = @tag.project

    @document = create(:document, project: @project, tags_attributes: [{
      text: @tag.text,
    }])

    as_user(@project.owner)
  end

  test 'should update tag and increment document versions' do
    assert_difference(-> { @document.reload.remote_version }) do
      patch api_v1_project_tag_url(@project, @tag), params: {
        tag: {
          text: 'Renamed Tag'
        },
      }
    end

    assert_response :success
    assert_equal 'Renamed Tag', @tag.reload.text
  end

  test 'returns 422 when tag is invalid' do
    patch api_v1_project_tag_url(@project, @tag), params: {
      tag: {
        text: ''
      },
    }

    assert_response :unprocessable_entity
  end
end
