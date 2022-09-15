require 'test_helper'

class DocumentSearchControllerTest < ActionDispatch::IntegrationTest
  test 'skipped' do
    skip 'Elasticsearch has been disabled; skipping tests'
  end

  # setup do
  #   @project = create(:project)
  #   @first_document = create(:document, project: @project, title: 'My First Document', body: '<p>Lorem Ipsum</p>')
  #   @second_document = create(:document, project: @project, title: 'My Second Document', body: '<p>Dolor Sit</p> <!-- This is a comment -->')

  #   @secret_project = create(:project)
  #   @secret_document = create(:document, project: @secret_project, title: 'My Secret Document', body: '<p>Shhhhh!</p>')

  #   @boosting_project = create(:project)
  #   @boosting_document_1 = create(:document, project: @boosting_project, title: 'One', body: '<p>Two two</p>')
  #   @boosting_document_2 = create(:document, project: @boosting_project, title: 'Two', body: '<p>One one</p>')

  #   Document.import force: true, refresh: true
  # end

  # test 'searches in title' do
  #   results = search('first')
  #   assert_search_includes results, @first_document
  #   refute_search_includes results, @second_document
  # end

  # test 'searches in plain text body' do
  #   lorem_results = search('lorem')
  #   assert_search_includes lorem_results, @first_document
  #   refute_search_includes lorem_results, @second_document

  #   comment_results = search('comment')
  #   refute_search_includes comment_results, @second_document
  # end

  # test 'does not search in other projects' do
  #   results = search('my', project: @project)
  #   assert_search_includes results, @first_document
  #   assert_search_includes results, @second_document
  #   refute_search_includes results, @secret_document
  # end

  # test 'matches in the title are preferred to matches in the body' do
  #   assert_equal ids([@boosting_document_1, @boosting_document_2]), ids(search('one', project: @boosting_project))
  #   assert_equal ids([@boosting_document_2, @boosting_document_1]), ids(search('two', project: @boosting_project))
  # end

  # test 'matches words out of order' do
  #   results = search('document first')
  #   assert_search_includes(results, @first_document)
  # end

  # test 'ignores non-matching words in query' do
  #   results = search('the first document')
  #   assert_search_includes(results, @first_document)
  # end

  # test 'ignores non-matching words in text' do
  #   results = search('my document')
  #   assert_search_includes(results, @first_document)
  # end

  # test 'matches the beginning of a term' do
  #   results = search('docu')
  #   assert_search_includes(results, @first_document)
  # end

  # private

  # def search(query, project: @project, select: 'all')
  #   get api_v1_project_document_search_url(project, q: query, select: select)
  #   assert_response :success

  #   JSON.parse(response.body).map { _1.fetch('document') }
  # end

  # def assert_search_includes(search_results, document, *args)
  #   assert_includes ids(search_results), document.id, *args
  # end

  # def refute_search_includes(search_results, document, *args)
  #   refute_includes ids(search_results), document.id, *args
  # end

  # def ids(collection)
  #   collection.map do |x|
  #     if x.respond_to?(:id)
  #       x.id
  #     else
  #       x.fetch('id')
  #     end
  #   end
  # end
end
