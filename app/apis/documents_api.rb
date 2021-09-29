class DocumentsAPI < ApplicationAPI
  def index
    set_project

    documents =
      if keyword_id = params[:keyword_id]
        @project.keywords.find(keyword_id).documents
      else
        @project.documents
      end

    if params[:pinned]
      documents = documents.pinned
    end

    sort_by = validate_param(
      params.fetch(:sort_by, 'created_at'),
      allowed_values: %w(created_at updated_at pinned_at),
    )

    sort_direction = validate_param(
      params.fetch(:sort_direction, 'desc'),
      allowed_values: %w(asc desc),
    )

    documents.not_blank.order(sort_by => sort_direction).map do |document|
      document.query(params[:query])
    end
  end

  def show
    set_project

    @project.documents.find(params[:id]).query(params[:query])
  end

  private

  def set_project
    @project = Project.find(params[:project_id])
  end
end
