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

  test 'documents_count is incremented and decremented when documents are created and destroyed' do
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

  test 'documents_count is not incremented by blank documents until they become non-blank' do
    project = create(:project)

    tag = create(:tag, project: project, text: 'A tag')
    assert_equal 0, tag.documents_count

    document = Document.create!(project: project, tags_attributes: [
      { text: tag.text },
    ], blank: true)

    assert_equal 0, tag.reload.documents_count

    document.update!(blank: false)

    assert_equal 1, tag.reload.documents_count
  end

  test 'sequence_before_and_after throws an error when the tag is not a sequence' do
    tag = create(:tag, sequence: false)
    document = create(:document, tags: [tag])

    assert_raises(RuntimeError) do
      tag.sequence_before_and_after(document)
    end
  end

  test 'sequence_before_and_after throws an error when the document is not in the sequence' do
    tag = create(:tag, sequence: true)
    document = create(:document)

    assert_raises(RuntimeError) do
      tag.sequence_before_and_after(document)
    end
  end

  test 'sequence_before_and_after returns the documents before and after in the sequence' do
    tag = create(:tag, sequence: true)
    document_1 = create(:document, tags: [tag])
    document_2 = create(:document, tags: [tag])
    document_3 = create(:document, tags: [tag])
    document_4 = create(:document, tags: [tag], blank: true)

    ab1 = tag.sequence_before_and_after(document_1)
    ab2 = tag.sequence_before_and_after(document_2)
    ab3 = tag.sequence_before_and_after(document_3)
    ab4 = tag.sequence_before_and_after(document_4)

    assert_nil ab1[0], 'document_1 has no document before it'
    assert_equal document_2.id, ab1[1][:id], 'document_1 has document_2 after it'

    assert_equal document_1.id, ab2[0][:id], 'document_2 has document_1 before it'
    assert_equal document_3.id, ab2[1][:id], 'document_2 has document_3 after it'

    assert_equal document_2.id, ab3[0][:id], 'document_3 has document_2 before it'
    assert_nil ab3[1], 'document_3 has no document after it'

    assert_equal document_3.id, ab4[0][:id], 'document_4 has document_3 before it'
    assert_nil ab4[1], 'document_4 has no document after it'
  end
end
