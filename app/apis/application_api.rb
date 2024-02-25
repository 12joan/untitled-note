class ApplicationAPI
  attr_reader :params

  def initialize(user:, params:)
    @user = user
    @params = params
  end

  protected

  def set_project
    project_id = block_given? ? yield : params[:project_id]
    @project = @user.projects.find(project_id)
  end

  def set_document
    document_id = block_given? ? yield : params[:document_id]
    @document = @user.documents.find(document_id)
  end

  def validate_param(value, allowed_values:)
    allowed_values.map { [_1, _1] }.to_h.fetch(value)
  end
end
