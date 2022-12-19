class TagsAPI < ApplicationAPI
  def index
    set_project

    @project.tags.order('documents_count DESC, id').all.map do |tag|
      tag.query(params[:query])
    end
  end
end
