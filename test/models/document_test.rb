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

  test 'accepts keywords when keyword does not exist' do
    project = create(:project)

    document = assert_difference('Keyword.count', 2) do
      Document.create!(project: project, keywords_attributes: [
        { text: 'Hello' },
        { text: 'World' },
      ])
    end

    assert_equal ['Hello', 'World'].sort, document.keywords.pluck(:text).sort
  end

  test 'accepts keywords when keyword already exists' do
    project = create(:project)

    keyword1 = create(:keyword, project: project)
    keyword2 = create(:keyword, project: project)

    document = assert_no_difference('Keyword.count') do
      Document.create!(project: project, keywords_attributes: [
        { text: keyword1.text },
        { text: keyword2.text },
      ])
    end

    assert_equal [keyword1.id, keyword2.id].sort, document.keywords.pluck(:id).sort
  end

  test 'cannot add the same keyword twice' do
    project = create(:project)

    keyword = create(:keyword, project: project)

    document = Document.create!(project: project, keywords_attributes: [
      { text: keyword.text },
      { text: keyword.text },
    ])

    assert_equal 1, document.keywords.count, 'should have 1 keyword'

    document.update!(keywords_attributes: [
      { text: keyword.text },
    ])

    assert_equal 1, document.keywords.count, 'should have 1 keyword'
  end

  test 'existing keywords not in keywords_attributes are disassociated from document' do
    project = create(:project)

    keyword1 = create(:keyword, project: project)
    keyword2 = create(:keyword, project: project)

    document = Document.create!(project: project, keywords_attributes: [
      { text: keyword1.text },
      { text: keyword2.text },
    ])

    assert_equal 2, document.keywords.count, 'should have 2 keywords'

    document.update(keywords_attributes: [
      { text: keyword1.text },
    ])

    assert_equal 1, document.keywords.count, 'should have 1 keyword'
  end

  test 'can remove the last keyword' do
    project = create(:project)

    keyword = create(:keyword, project: project)

    document = Document.create!(project: project, keywords_attributes: [
      { text: keyword.text },
    ])

    assert_equal 1, document.keywords.count, 'should have 1 keyword'

    document.update(keywords_attributes: [])

    document.reload

    assert_empty document.keywords
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

  test 'calling extract_definitive_mentions affects the result of definitive_mentions' do
    document = create(:document)
    assert_empty document.definitive_mentions
    document.extract_definitive_mentions(body_with_definitive_mentions(%w(one two three)))
    assert_equal %w(one two three), document.definitive_mentions
  end

  test 'extracts plain_body from HTML body' do
    document = create(:document, body: <<~HTML)
      <h1>This is a heading</h1>
      <p>This is a paragraph</p>
      <ul>
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
      </ul>
    HTML

    assert_equal 'This is a heading This is a paragraph • One • Two • Three', document.plain_body
  end

  test 'preview returns up to 100 characters of plain_body without breaking part way through a word' do
    body = 'The quick brown fox jumps over the lazy dog ' * 3

    # body.slice(0, 100)
    # => 'The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick br'

    expected_preview = 'The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick'

    document = create(:document, body: body)
    assert_equal expected_preview, document.preview
  end

  test 'preview breaks at 100 if there are no spaces' do
    document = create(:document, body: 'a' * 200)
    assert_equal 'a' * 100, document.preview
  end

  private

  def body_with_definitive_mentions(definitive_mentions)
    definitive_mentions
      .map { |text| "<p><x-definitive-mention>#{text}</x-definitive-mention></p>" }
      .join
  end
end
