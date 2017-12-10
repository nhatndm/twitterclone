module Api::V1
  class TwittersController < ApplicationController
    before_action :authenticate_user!, :init_twitter

    def load_tweet
      render_result(client.user_timeline('twitter'))
    end

    def retweet
      client.retweet(params[:tweet_id])
      render_result('You have been successfully retweeted')
    end

    def follow
      client.follow(params[:tweeter_name])
      render_result('You have been successfully followed')
    end

    private

    def client
      @client
    end

    def init_twitter
      @client = Twitter::REST::Client.new do |config|
        config.consumer_key        = ENV['CONSUMER_KEY']
        config.consumer_secret     = ENV['CONSUMER_SECRET']
        config.access_token        = current_user.provider_access_token
        config.access_token_secret = current_user.provider_access_token_secret
      end
    end
  end
end
