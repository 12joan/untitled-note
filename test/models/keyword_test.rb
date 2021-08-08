require 'test_helper'

class KeywordTest < ActiveSupport::TestCase
  test 'cannot create two identical keywords in the same project' do
    project = create(:project)

    assert_raises(ActiveRecord::RecordInvalid) do
      create(:keyword, project: project, text: 'A keyword')
      create(:keyword, project: project, text: 'A keyword')
    end
  end

  test 'can create two identical keywords in separate projects' do
    project1 = create(:project)
    project2 = create(:project)

    create(:keyword, project: project1, text: 'A keyword')
    create(:keyword, project: project2, text: 'A keyword')
  end
end
