Rails.application.reloader.to_prepare do
  Rails.application.config.data_streaming_config = DataStreamingConfig.new(
    apis: {
      Document: {
        api_controller: DocumentsAPI,

        actions: {
          index: ->(params) { "Document#index(project_id: #{params.fetch(:project_id)})" },
        },
      },
    },

    listeners: {
      Document: ->(document) {
        broadcast "Document#index(project_id: #{document.project_id})"
      },
    },
  )
end
