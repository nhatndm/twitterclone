class OauthService
  def execute(auth_object)
    user = User.find_or_create_by!(uid: auth_object[:id]) do |u|
      password = Devise.friendly_token[0, 20]
      u.provider = auth_object[:provider]
      u.uid = auth_object[:id]
      u.name = auth_object[:name]
      u.password = password
      u.password_confirmation = password
      u.confirmed_at = Time.zone.now
      u.email = auth_object[:email]
    end
    user.provider_access_token = auth_object[:access_token]
    user.provider_access_token_secret = auth_object[:access_token_secret] ||= auth_object[:access_token]
    {
      headers: create_header_token(user),
      userinfo: user,
    }
  end

  def create_header_token(user)
    token = user.create_new_auth_token
  end
end