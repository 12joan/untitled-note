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
          index: ->(params) { make_broadcasting('Document#index', %i[user_id project_id], params) },
          show: ->(params) { make_broadcasting('Document#show', %i[user_id id], params) },
        },
      },

      Tag: {
        api_controller: TagsAPI,

        actions: {
          index: ->(params) { make_broadcasting('Tag#index', %i[user_id project_id], params) },
          sequence: ->(params) { make_broadcasting('Tag#sequence', %i[user_id project_id id], params) },
        },
      },

      Project: {
        api_controller: ProjectsAPI,

        actions: {
          index: ->(params) { make_broadcasting('Project#index', %i[user_id], params) },
        },
      },

      ProjectFolder: {
        api_controller: ProjectFoldersAPI,

        actions: {
          index: ->(params) { make_broadcasting('ProjectFolder#index', %i[user_id], params) },
        },
      },

      FileStorage: {
        api_controller: FileStorageAPI,

        actions: {
          quota_usage: ->(params) { make_broadcasting('FileStorage#quota_usage', %i[user_id], params) },
          files: ->(params) { make_broadcasting('FileStorage#files', %i[user_id], params) },
        },
      },

      Snapshot: {
        api_controller: SnapshotsAPI,

        actions: {
          index: ->(params) { make_broadcasting('Snapshot#index', %i[user_id document_id], params) },
        },
      },

      Settings: {
        api_controller: SettingsAPI,

        actions: {
          show: ->(params) { make_broadcasting('Settings#show', %i[user_id], params) },
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
          broadcast make_broadcasting('Document#show', %i[user_id id], params)
          broadcast make_broadcasting('Tag#index', %i[user_id project_id], params)

          if document.sequence_tag_id
            broadcast make_broadcasting('Tag#sequence', %i[user_id project_id id], {
              user_id: document.project.owner_id,
              project_id: document.project_id,
              id: document.sequence_tag_id,
            })
          end
        end
      },

      Tag: ->(tag) {
        # This is sometimes called after the tag's project has been destroyed
        unless tag.project.nil?
          broadcast make_broadcasting('Tag#index', %i[user_id project_id], {
            user_id: tag.project.owner_id,
            project_id: tag.project_id,
          })

          broadcast make_broadcasting('Tag#sequence', %i[user_id project_id id], {
            user_id: tag.project.owner_id,
            project_id: tag.project_id,
            id: tag.id,
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

      ProjectFolder: ->(project_folder) {
        broadcast make_broadcasting('ProjectFolder#index', %i[user_id], {
          user_id: project_folder.owner_id,
        })

        broadcast make_broadcasting('Project#index', %i[user_id], {
          user_id: project_folder.owner_id,
        })
      },

      S3File: ->(s3_file) {
        %w(quota_usage files).each do |action|
          broadcast make_broadcasting("FileStorage##{action}", %i[user_id], {
            user_id: s3_file.owner.id,
          })
        end

        broadcast_for s3_file.original_project if s3_file.role == 'project-image'
      },

      Snapshot: ->(snapshot) {
        broadcast make_broadcasting('Snapshot#index', %i[user_id document_id], {
          user_id: snapshot.owner.id,
          document_id: snapshot.document_id,
        })
      },

      Settings: ->(settings) {
        broadcast make_broadcasting('Settings#show', %i[user_id], {
          user_id: settings.user.id,
        })
      },
    },
  )
end
