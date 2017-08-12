class User < ApplicationRecord
  validates :email, presence: true
  validates :link, presence: true
  validates :name, presence: true

  has_many :providers, dependent: :destroy
  has_many :events, dependent: :destroy
  has_many :trips, dependent: :destroy
  has_many :passengers, foreign_key: :driver_id, dependent: :destroy
  has_many :passengers, foreign_key: :passenger_id, dependent: :destroy

  def self.create_linked! email:, link:, name:, provider:, uid:
    user = User.create! email: email,
                        link: link,
                        name: name

    Provider.create! user_id: user.id,
                     provider: Provider.providers[provider],
                     uid: uid
  end  

  def self.find_linked provider:, uid:
    return User.joins(:providers)
             .where('providers.provider' => Provider.providers[provider])
             .where('providers.uid' => uid)
             .first
  end

  def self.load_example! count: 1, skip: 0
    users = Array.new

    count.times do |_i|
      i = _i + skip
      users.push(User.create_linked! email: "ztest#{i}@gmail.com",
                                     link: "facebook.com/link/to/user/#{i}",
                                     name: "Z Test#{i}",
                                     provider: :facebook,
                                     uid: "85207512461240513513#{i}")
    end

    return count == 1 ? users.first : users
end
end
