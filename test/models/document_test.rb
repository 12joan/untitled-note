require 'test_helper'

class DocumentTest < ActiveSupport::TestCase
  test 'safe_title == title when title is present' do
    document = create(:document, title: 'Hi')
    assert_equal 'Hi', document.safe_title
  end

  test 'safe_title takes a default value when title is absent' do
    document = create(:document, title: '')
    assert_equal 'Untitled document', document.safe_title
  end

  test 'accepts tags when tag does not exist' do
    project = create(:project)

    document = assert_difference('Tag.count', 2) do
      Document.create!(project: project, tags_attributes: [
        { text: 'Hello' },
        { text: 'World' },
      ])
    end

    assert_equal ['Hello', 'World'].sort, document.tags.pluck(:text).sort
  end

  test 'accepts tags when tag already exists' do
    project = create(:project)

    tag1 = create(:tag, project: project)
    tag2 = create(:tag, project: project)

    document = assert_no_difference('Tag.count') do
      Document.create!(project: project, tags_attributes: [
        { text: tag1.text },
        { text: tag2.text },
      ])
    end

    assert_equal [tag1.id, tag2.id].sort, document.tags.pluck(:id).sort
  end

  test 'cannot add the same tag twice' do
    project = create(:project)

    tag = create(:tag, project: project)

    document = Document.create!(project: project, tags_attributes: [
      { text: tag.text },
      { text: tag.text },
    ])

    assert_equal 1, document.tags.count, 'should have 1 tag'

    document.update!(tags_attributes: [
      { text: tag.text },
    ])

    assert_equal 1, document.tags.count, 'should have 1 tag'
  end

  test 'existing tags not in tags_attributes are disassociated from document' do
    project = create(:project)

    tag1 = create(:tag, project: project)
    tag2 = create(:tag, project: project)

    document = Document.create!(project: project, tags_attributes: [
      { text: tag1.text },
      { text: tag2.text },
    ])

    assert_equal 2, document.tags.count, 'should have 2 tags'

    document.update(tags_attributes: [
      { text: tag1.text },
    ])

    assert_equal 1, document.tags.count, 'should have 1 tag'
  end

  test 'can remove the last tag' do
    project = create(:project)

    tag = create(:tag, project: project)

    document = Document.create!(project: project, tags_attributes: [
      { text: tag.text },
    ])

    assert_equal 1, document.tags.count, 'should have 1 tag'

    document.update(tags_attributes: [])

    document.reload

    assert_empty document.tags
  end

  test 'pinned scope contains all pinned documents' do
    document1 = create(:document, pinned_at: nil)
    document2 = create(:document, pinned_at: nil)
    document3 = create(:document, pinned_at: DateTime.now)
    document4 = create(:document, pinned_at: DateTime.now)
    document5 = create(:document, pinned_at: nil)
    document6 = create(:document, pinned_at: DateTime.now)

    assert_equal [document3, document4, document6], Document.pinned
  end

  test 'preview returns up to 100 characters of plain_body' do
    [
      ['a' * 200, 'a' * 100],
      ['', 'This document has no content'],
      [
        'The quick brown fox jumps over the lazy dog ' * 3,
        'The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick',
      ],
      [
        'This, is! a. sentence; \'with\' ~punctuation~',
        'This, is! a. sentence; \'with\' ~punctuation~',
      ],
      [
        ('a' * 92) + ' loooooooooong short',
        'a' * 92,
      ],
    ].each do |plain_body, expected_preview|
      document = create(:document, plain_body: plain_body)
      assert_equal expected_preview, document.preview, "preview for #{plain_body.inspect}"
    end
  end
end
