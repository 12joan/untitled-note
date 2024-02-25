require 'test_helper'

class DocumentSnapshotsControllerTest < ActionDispatch::IntegrationTest
  include SlateJSONHelper

  setup do
    @body = create_document_body do
      p { text 'Hello, world!' }
    end

    @document = create(:document, body_type: 'json/slate', body: @body)
    @project = @document.project
    as_user(@project.owner)
  end

  test 'should create snapshot' do
    assert_difference(-> { @document.snapshots.count }) do
      post api_v1_project_document_snapshots_url(@project, @document), params: {
        snapshot: {
          name: 'Snapshot 1'
        },
      }
    end

    assert_response :success
    assert_equal 'Snapshot 1', Snapshot.last.name
    assert_equal @body, Snapshot.last.body
  end
end
