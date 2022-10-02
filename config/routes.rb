Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :projects do
        resources :documents, only: %i[ show create update destroy ] do
          # resource :markdown, only: %i[ show ], controller: 'document_markdown'
        end

        resource :blank_document, only: %i[ create ]

        # resource :document_search, only: %i[ show ], controller: 'document_search'
      end
    end
  end

  if Rails.env.test?
    resource :stub_login, only: %i[ create ], controller: 'stub_login'
  end

  namespace :admin do
    resource :elasticsearch, only: %i[ show create ], controller: 'elasticsearch'
  end

  get '/auth/auth0/callback', to: 'auth0#callback'
  get '/auth/failure', to: 'auth0#failure'
  get '/auth/logout', to: 'auth0#logout'

  get '/welcome', to: 'welcome#index', as: :welcome

  root 'app#index', as: :app
  get '*path', to: 'app#index'
end
