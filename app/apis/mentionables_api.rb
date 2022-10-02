class MentionablesAPI < ApplicationAPI
  def index
    set_project

    @project
      .documents
      .preload(:aliases)
      .map { |document| [document.id, document.mentionables] }
      .to_h
  end
end
