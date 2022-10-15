module UploadAllowed
  def self.allowed?(user:, file_params:)
    case file_params.fetch(:role)
    when 'project-image'
      project_image_allowed?(user: user, file_params: file_params)
    else
      [false, 'Invalid role']
    end
  end

  private

  def self.project_image_allowed?(user:, file_params:)
    if file_params.fetch(:size) > 300 * 1024
      return [false, 'File is too large']
    end

    unless file_params.fetch(:content_type).start_with?('image/')
      return [false, 'File is not an image']
    end

    true
  end
end
