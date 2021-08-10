require 'test_helper'

class DocumentTest < ActiveSupport::TestCase
  test 'creating a document creates a new title alias' do
    assert_difference('Alias.count') do
      create(:document)
    end

    title = Alias.last

    assert_predicate title, :title?
    assert_equal '', title.text, 'title should be blank'
  end

  test 'creating a document with a specified title creates a new title alias with that title' do
    assert_difference('Alias.count') do
      create(:document, title: 'Hello World')
    end

    title = Alias.last

    assert_predicate title, :title?
    assert_equal 'Hello World', title.text
  end

  test '#update(title: ...) modifies the title alias' do
    document = create(:document)
    document.update title: 'New title'
    assert_equal 'New title', document.title, 'in-memory instance should be updated'

    reloaded_document = Document.find(document.id)
    assert_equal 'New title', reloaded_document.title, 'in-database instance should be updated'
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
end
