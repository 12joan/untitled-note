json.extract! keyword, :id, :text, :project_id, :created_at, :updated_at
json.url api_v1_project_keyword_url(keyword.project, keyword, format: :json)
