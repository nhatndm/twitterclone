class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  include ApiHelper
  rescue_from Exception, with: :render_500
end
