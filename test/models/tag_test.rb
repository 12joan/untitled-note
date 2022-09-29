require 'test_helper'

class TagTest < ActiveSupport::TestCase
  test 'cannot create two identical tags in the same project' do
    project = create(:project)

    assert_raises(ActiveRecord::RecordInvalid) do
      create(:tag, project: project, text: 'A tag')
      create(:tag, project: project, text: 'A tag')
    end
  end

  test 'can create two identical tags in separate projects' do
    project1 = create(:project)
    project2 = create(:project)

    create(:tag, project: project1, text: 'A tag')
    create(:tag, project: project2, text: 'A tag')
  end

  test 'documents_count is incremented when a new DocumentsTag is created' do
    project = create(:project)

    tag = create(:tag, project: project, text: 'A tag')
    assert_equal 0, tag.documents_count

    document1 = Document.create!(project: project, tags_attributes: [
      { text: tag.text },
    ])

    assert_equal 1, tag.reload.documents_count

    document2 = Document.create!(project: project, tags_attributes: [
      { text: tag.text },
    ])

    assert_equal 2, tag.reload.documents_count

    document1.destroy!

    assert_equal 1, tag.reload.documents_count
  end
end
