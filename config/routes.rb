Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'app#index'

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :documents, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
