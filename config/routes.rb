Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :projects do
        resources :documents
        resource :blank_document, only: [:create]

        resources :keywords do
          resources :keyword_documents, only: [:index]
        end
      end
    end
  end

  root 'app#index'
  get '*path', to: 'app#index'
end
