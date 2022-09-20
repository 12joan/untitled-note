Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :projects do
        resources :documents, only: %i[ show create update destroy ] do
          resource :markdown, only: %i[ show ], controller: 'document_markdown'
        end

        resource :blank_document, only: %i[ create ]

        resource :document_search, only: %i[ show ], controller: 'document_search'
      end
    end
  end

  namespace :admin do
    resource :elasticsearch, only: %i[ show create ], controller: 'elasticsearch'
  end

  root 'app#index'
  get '*path', to: 'app#index'
end
