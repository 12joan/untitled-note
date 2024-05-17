require 'test_helper'

class ProjectFolderTest < ActiveSupport::TestCase
  test 'should move projects to end of list when deleted' do
    user = create(:user)
    project_folder = create(:project_folder, owner: user)

    inside_1 = create(:project, owner: user, folder: project_folder, order_string: '1')
    inside_2 = create(:project, owner: user, folder: project_folder, order_string: '2')
    inside_3 = create(:project, owner: user, folder: project_folder, order_string: '3')
    outside = create(:project, owner: user, order_string: '4')

    project_folder.destroy!

    assert_equal(
      [outside.id, inside_1.id, inside_2.id, inside_3.id],
      user.projects.order(:order_string).pluck(:id)
    )
  end
end
