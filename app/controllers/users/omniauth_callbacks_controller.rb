class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    req = request.env['omniauth.auth']
    @user = User.from_omniauth(req)
    #@user = User.from_omniauth(request.env['omniauth.auth'])

    sign_in @user
    redirect_to '/dashboard/index'
  end

  def failure
    redirect_to root_path
  end
end