require 'test_helper'

class CleanUpUnusedAttachmentsTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
    @project = create(:project, owner: @user)
    @document = create(:document, project: @project)
    @s3_file = create(:s3_file, role: 'attachment', became_unused_at: 25.hours.ago, owner: @user)
  end

  test 'should delete unused attachments' do
    perform
    assert destroyed?, 'unused attachment should be deleted'
  end

  test 'should not delete used attachments, even if became_unused_at is wrong' do
    create(:documents_s3_file, document: @document, s3_file: @s3_file)
    @s3_file.update!(became_unused_at: 25.hours.ago)
    perform
    assert_not destroyed?, 'used attachment should not be deleted'
  end

  test 'should not delete recently used attachments' do
    @s3_file.update!(became_unused_at: 23.hours.ago)
    perform
    assert_not destroyed?, 'recently used attachment should not be deleted'
  end

  test 'should not delete non-attachment s3 files' do
    @s3_file.update!(role: 'project-image')
    perform
    assert_not destroyed?, 'non-attachment s3 file should not be deleted'
  end

  test 'should not delete attachments marked as do_not_delete_unused' do
    @s3_file.update!(do_not_delete_unused: true)
    perform
    assert_not destroyed?, 'attachment marked as do_not_delete_unused should not be deleted'
  end

  private

  def perform
    ignore_s3 { CleanUpUnusedAttachments.perform }
  end

  def destroyed?
    !S3File.find_by(id: @s3_file.id)
  end
end
