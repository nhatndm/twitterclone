module Api::V1
  class OauthsController < ApplicationController
    before_action :generate_auth_object

    def create
      oauth = oauth_service.execute(@auth_object)
      assign_header_token oauth[:headers]
      render_result(oauth[:userinfo]); 
    end

    private

    def oauth_service 
      OauthService.new
    end

    def assign_header_token(token)
      token.each do |k, v|
        response.set_header(k, v)
      end
    end

    def generate_auth_object
      @auth_object = params.fetch(:oauth)
    end
  end
end

