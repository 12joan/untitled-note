require 'test_helper'

class MentionablesAPITest < APITestCase
  setup do
    @project = create(:project)
    @other_project = create(:project)

    @first_document = create_document_with_aliases({ project: @project, title: 'Title 1' }, ['Alias 1.1', 'Alias 1.2'])
    create_document_with_aliases({ project: @project, title: 'Title 2' }, [])
    create_document_with_aliases({ project: @project, title: nil }, ['Alias 3.1'])
    create_document_with_aliases({ project: @project, title: 'Singular' }, ['Plurals', 'Person'])

    create_document_with_aliases({ project: @other_project, title: 'Other Title' }, ['Other Alias'])

    @index_params = {
      project_id: @project.id,
    }
  end

  test 'groups mentionables by document id' do
    assert_includes index_result.fetch(@first_document.id), 'Title 1'
  end

  test 'includes titles' do
    ['Title 1', 'Title 2'].each do |mentionable|
      assert_includes mentionables, mentionable
    end
  end

  test 'includes aliases' do
    ['Alias 1.1', 'Alias 1.2'].each do |mentionable|
      assert_includes mentionables, mentionable
    end
  end

  test 'does not include nil' do
    refute_includes mentionables, nil
  end

  test 'does not include titles or aliases from other projects' do
    ['Other Title', 'Other Alias'].each do |mentionable|
      refute_includes mentionables, mentionable
    end
  end 

  test 'includes plurals of singular titles and aliases' do
    ['Singular', 'Singulars', 'Plurals', 'Person', 'People'].each do |mentionable|
      assert_includes mentionables, mentionable
    end
  end

  private

  def create_document_with_aliases(document_params, aliases)
    create(:document, **document_params).tap do |document|
      aliases.each { |text| create(:alias, document: document, text: text) }
    end
  end

  def index_result
    MentionablesAPI.new(@index_params).index
  end

  def mentionables
    index_result.values.flatten(1)
  end
end
