Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  root to: 'splash#index'
  get      '/dashboard/index',     to: 'dashboard#index'
  get      '/dashboard/event',     to: 'dashboard#event'
  get      '/events/fetch',        to: 'events#fetch'
  post     '/events/post',         to: 'events#post'
  post     '/events/delete',       to: 'events#delete'
  post     '/events/edit',         to: 'events#edit'

  devise_scope :user do
    delete 'sign_out',             to: 'devise/sessions#destroy', as: :destroy_user_session
  end
end
