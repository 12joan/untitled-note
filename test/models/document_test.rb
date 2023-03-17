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

  test 'was_updated_on_server sets updated_by without saving' do
    document = create(:document, updated_by: 'someclient')
    document.was_updated_on_server
    assert_equal 'server', document.updated_by
    assert_equal 'someclient', document.reload.updated_by
  end

  test 'was_updated_on_server! sets updated_by and saves' do
    document = create(:document, updated_by: 'someclient')
    document.was_updated_on_server!
    assert_equal 'server', document.reload.updated_by
  end

  test 'search returns up to date documents matching query and project' do
    my_project = create(:project)
    other_project = create(:project)

    # Simple cases
    document1 = create(:document, project: my_project, title: 'Document 1', plain_body: 'one two three')
    document2 = create(:document, project: my_project, title: 'Document 2 with three in title', plain_body: 'four five six')
    document3 = create(:document, project: my_project, title: 'Document 3', plain_body: 'seven eight nine')

    # Destroyed
    document4 = create(:document, project: my_project, title: 'Document 4', plain_body: 'three')
    document4.destroy!

    # Updated to match
    document5 = create(:document, project: my_project, title: 'Document 5', plain_body: 'two')
    document5.update!(plain_body: 'three')

    # Updated to not match
    document6 = create(:document, project: my_project, title: 'Document 6', plain_body: 'three')
    document6.update!(plain_body: 'four')

    # In other project
    document7 = create(:document, project: other_project, title: 'Document 7', plain_body: 'three')

    matching_ids = search_ids(project: my_project, query: 'three')

    assert_includes matching_ids, document1.id, 'should match document1'
    assert_includes matching_ids, document2.id, 'should match document2'
    refute_includes matching_ids, document3.id, 'should not match document3'
    refute_includes matching_ids, document4.id, 'should not match destroyed document4'
    assert_includes matching_ids, document5.id, 'should match updated document5'
    refute_includes matching_ids, document6.id, 'should not match updated document6'
    refute_includes matching_ids, document7.id, 'should not match document7 from other project'
  end

  test 'search ignores case' do
    document = create(:document, plain_body: 'one two three')
    matching_ids = search_ids(project: document.project, query: 'ONE')
    assert_includes matching_ids, document.id, 'should match document'
  end

  test 'search ignores term order' do
    document = create(:document, title: 'one two three', plain_body: '')
    matching_ids = search_ids(project: document.project, query: 'three one')
    assert_includes matching_ids, document.id, 'should match document'
  end

  test 'search ignores non-matching terms' do
    document = create(:document, plain_body: 'one two three')
    matching_ids = search_ids(project: document.project, query: 'one four')
    assert_includes matching_ids, document.id, 'should match document'
  end

  test 'search uses prefix matching' do
    document = create(:document, plain_body: 'one two three')
    assert_includes search_ids(project: document.project, query: 'thr'), document.id, 'should match document'
    refute_includes search_ids(project: document.project, query: 'ree'), document.id, 'should not match document'
  end

  test 'search uses fuzzy matching' do
    document = create(:document, plain_body: 'one two three')
    matching_ids = search_ids(project: document.project, query: 'trhee')
    assert_includes matching_ids, document.id, 'should match document'
  end

  test 'search ignores simple plurals' do
    document = create(:document, plain_body: 'one two three')
    matching_ids = search_ids(project: document.project, query: 'threes')
    assert_includes matching_ids, document.id, 'should match document'
  end

  test 'destroy works when document is not indexed in typesense' do
    document = nil

    assert_difference 'Document.count' do
      document = create(:document)
    end

    document.destroy_from_typesense

    assert_difference 'Document.count', -1 do
      document.destroy
    end
  end

  private

  def search_ids(project:, query:)
    Document.search(project: project, query: query).map { |hit| hit.dig('document', 'id').to_i }
  end
end
