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
end
