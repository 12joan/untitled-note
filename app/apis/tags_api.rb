class TagsAPI < ApplicationAPI
  def index
    set_project
    unsorted_tags = @project.tags.all
    sorted_tags = unsorted_tags.sort_by { |tag| -tag.documents_count }
    sorted_tags.map { |tag| tag.query(params[:query]) }
  end

  def sequence
    set_project
    tag = @project.tags.find(params[:id])
    document = @project.documents.find(params[:document_id])
    tag.sequence_before_and_after(document)
  end
end
