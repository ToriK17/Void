Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts, only: [:index, :create, :update]
    end
  end
  root to: 'home#index'

  # Catch-all route to handle other paths and pass them to the React app
  get '*path', to: 'home#index', constraints: ->(req) { req.format.html? }
  
  # EXAMPLE HTML ROUTE
  # get "/photos" => "photos#index"

  # EXAMPLE JSON ROUTE WITH API NAMESPACE
  # namespace :api do
  #   get "/photos" => "photos#index"
  # end
end
