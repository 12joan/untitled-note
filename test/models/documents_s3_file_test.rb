require 'test_helper'

class DocumentsS3FileTest < ActiveSupport::TestCase
  include SlateJSONHelper

  def setup
    @user_1 = create(:user)
    @user_2 = create(:user)

    @s3_file_1 = create(:s3_file, owner: @user_1)
    @s3_file_2 = create(:s3_file, owner: @user_1)

    @user_1_project = create(:project, owner: @user_1)
    @user_2_project = create(:project, owner: @user_2)
  end

  test 'document with no attachments has no linked s3_files' do
    document = create_document_with_attachment_ids([], project: @user_1_project)
    assert_empty document.s3_files
  end

  test 'document with one attachment has one linked s3_file' do
    document = create_document_with_attachment_ids([@s3_file_1.id], project: @user_1_project)
    assert_equal [@s3_file_1], document.s3_files
  end

  test 'linked s3_files are updated when document is updated' do
    document = create_document_with_attachment_ids([@s3_file_1.id], project: @user_1_project)
    document.update!(body: document_body_with_attachment_ids([@s3_file_2.id]))
    assert_equal [@s3_file_2], document.s3_files
  end

  test 'no error when s3 file does not exist' do
    fake_s3_file_id = 123456789
    assert_nil S3File.find_by(id: fake_s3_file_id)
    document = create_document_with_attachment_ids([fake_s3_file_id], project: @user_1_project)
    assert_empty document.s3_files
  end

  test 'cannot link s3 file belonging to another user' do
    document = create_document_with_attachment_ids([@s3_file_1.id], project: @user_2_project)
    assert_empty document.s3_files
  end

  private

  def create_document_with_attachment_ids(s3_file_ids, **args)
    create(
      :document,
      body: document_body_with_attachment_ids(s3_file_ids),
      body_type: 'json/slate',
      **args
    )
  end

  def document_body_with_attachment_ids(s3_file_ids)
    create_document_body do
      p do
        text 'Hello, world!'
      end

      s3_file_ids.each do |s3_file_id|
        # Future proofing: Make sure attachments in descendants are counted
        p do
          p do
            attachment s3_file_id: s3_file_id, filename: 'test.txt'
          end
        end
      end
    end
  end
end
