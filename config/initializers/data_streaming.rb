def make_broadcasting(action, allowed_params, params)
  params_string = params
    .slice(*allowed_params)
    .sort
    .to_h
    .transform_values(&:to_s)
    .to_json

  "#{action}(#{params_string})"
end

Rails.application.reloader.to_prepare do
  Rails.application.config.data_streaming_config = DataStreamingConfig.new(
    apis: {
      Document: {
        api_controller: DocumentsAPI,

        actions: {
          index: ->(params) { make_broadcasting('Document#index', %i[user_id project_id], params).tap { "listening on #{_1}" } },
          show: ->(params) { make_broadcasting('Document#show', %i[user_id project_id id], params) },
        },
      },

      Tag: {
        api_controller: TagsAPI,

        actions: {
          index: ->(params) { make_broadcasting('Tag#index', %i[user_id project_id], params) },
        },
      },

      Project: {
        api_controller: ProjectsAPI,

        actions: {
          index: ->(params) { make_broadcasting('Project#index', %i[user_id], params) },
        },
      },
    },

    listeners: {
      Document: ->(document) {
        unless document.blank
          params = {
            user_id: document.project.owner_id,
            project_id: document.project_id,
            id: document.id,
          }

          broadcast make_broadcasting('Document#index', %i[user_id project_id], params).tap { "broadcasting on #{_1}" }
          broadcast make_broadcasting('Document#show', %i[user_id project_id id], params)
        end
      },

      Tag: ->(tag) {
        # This is sometimes called after the tag's project has been destroyed
        unless tag.project.nil?
          broadcast make_broadcasting('Tag#index', %i[user_id project_id], {
            user_id: tag.project.owner_id,
            project_id: tag.project_id,
          })

          tag.documents.each { |document| broadcast_for document }
        end
      },

      DocumentsTag: ->(documents_tag) {
        broadcast_for documents_tag.tag
      },

      Project: ->(project) {
        broadcast make_broadcasting('Project#index', %i[user_id], {
          user_id: project.owner_id,
        })
      },
    },
  )
end
