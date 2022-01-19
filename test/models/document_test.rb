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
end
