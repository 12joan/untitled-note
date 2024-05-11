Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :projects, only: %i[create update destroy] do
        resources :documents, only: %i[show create update destroy] do
          resource :replace, only: %i[create], controller: :document_replace
          resources :snapshots, only: %i[create update destroy] do
            resource :restore, only: %i[create], controller: :snapshot_restore
          end
        end

        resources :tags, only: %i[update]
        resource :blank_document, only: %i[create]
        resource :image, only: %i[update], controller: :project_images
        resource :search, only: %i[show], controller: :search
        resource :replace, only: %i[create], controller: :project_replace
      end

      post 'projects/batch_update', to: 'projects#batch_update', as: :batch_update_projects

      resources :s3_files, only: %i[create destroy show]
      resource :settings, only: %i[update]
    end
  end

  unless Rails.env.production?
    resource :stub_login, only: %i[create], controller: 'stub_login'
  end

  get '/auth/auth0/callback', to: 'auth0#callback'
  get '/auth/failure', to: 'auth0#failure'
  delete '/auth/logout', to: 'auth0#logout'
  post '/auth/reset_password', to: 'auth0#reset_password'

  get '/welcome', to: 'welcome#index', as: :welcome

  root 'app#index', as: :app
  get '*path', to: 'app#index'
end
