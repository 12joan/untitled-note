Rails.application.reloader.to_prepare do
  Rails.application.config.data_streaming_config = DataStreamingConfig.new(
    apis: {
      Document: {
        api_controller: DocumentsAPI,

        actions: {
          index: ->(params) { "Document#index(project_id: #{params.fetch(:project_id)})" },
          show: ->(params) { "Document#show(project_id: #{params.fetch(:project_id)}, id: #{params.fetch(:id)})" },
        },
      },

      Tag: {
        api_controller: TagsAPI,

        actions: {
          index: ->(params) { "Tag#index(project_id: #{params.fetch(:project_id)})" },
        },
      },

      Project: {
        api_controller: ProjectsAPI,

        actions: {
          index: ->(params) { "Project#index" },
        },
      },

      Mentionable: {
        api_controller: MentionablesAPI,

        actions: {
          index: -> (params) { "Mentionable#index(project_id: #{params.fetch(:project_id)})" },
        },
      }
    },

    listeners: {
      Document: ->(document) {
        unless document.blank
          broadcast "Document#index(project_id: #{document.project_id})"
          broadcast "Document#show(project_id: #{document.project_id}, id: #{document.id})"
          broadcast "Mentionable#index(project_id: #{document.project_id})"
        end
      },

      Tag: ->(tag) {
        broadcast "Tag#index(project_id: #{tag.project_id})"
        tag.documents.each { |document| broadcast_for document }
      },

      Project: ->(project) {
        broadcast "Project#index"
      },
    },
  )
end
