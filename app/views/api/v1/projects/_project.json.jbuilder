json.extract! project, :id, :name, :created_at, :updated_at
json.url api_v1_project_url(project, format: :json)
