Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  scope 'api/v1' do
    post 'oauth', to: 'api/v1/oauths#create'
    scope 'twitter' do
      get 'load_tweet', to: 'api/v1/twitters#load_tweet'
      get 're_tweet', to: 'api/v1/twitters#retweet'
      get 'follow', to: 'api/v1/twitters#follow'
    end
  end
end
