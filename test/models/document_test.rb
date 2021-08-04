require 'test_helper'

class DocumentTest < ActiveSupport::TestCase
  test 'creating a document creates a new title alias' do
    assert_difference('Alias.count') do
      Document.create
    end

    title = Alias.last

    assert_predicate title, :title?
    assert_equal '', title.text, 'title should be blank'
  end

  test 'creating a document with a specified title creates a new title alias with that title' do
    assert_difference('Alias.count') do
      Document.create(title: 'Hello World')
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
end
