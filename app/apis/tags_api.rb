class TagsAPI < ApplicationAPI
  def index
    set_project

    unsorted_tags = @project.tags.all

    sorted_tags = unsorted_tags.sort_by { |tag| -tag.documents_count }

    sorted_tags.map do |tag|
      tag.query(params[:query])
    end
  end
end
