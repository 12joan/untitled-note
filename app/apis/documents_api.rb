class DocumentsAPI < ApplicationAPI
  def index
    set_project

    documents =
      if tag_id = params[:tag_id]
        @project.tags.find(tag_id).documents
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

    documents = documents.not_blank
    documents = documents.order(sort_by => sort_direction)

    if params[:per_page].present?
      documents = documents.page(params.fetch(:page, 1)).per(params.fetch(:per_page))
    end

    documents.map do |document|
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
