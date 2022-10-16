Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :projects, only: %i[create update destroy] do
        resources :documents, only: %i[show create update destroy]
        resource :blank_document, only: %i[create]
        resources :s3_files, only: %i[create destroy show]
        resource :image, only: %i[update], controller: :project_images
      end
    end
  end

  if Rails.env.test?
    resource :stub_login, only: %i[create], controller: 'stub_login'
  end

  get '/auth/auth0/callback', to: 'auth0#callback'
  get '/auth/failure', to: 'auth0#failure'
  get '/auth/logout', to: 'auth0#logout'

  get '/welcome', to: 'welcome#index', as: :welcome

  root 'app#index', as: :app
  get '*path', to: 'app#index'
end
