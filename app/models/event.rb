class Event < ApplicationRecord
  belongs_to :user
  validates :user, presence: true

  validates :name, presence: true
  validates :address, presence: true
  validates :time_start, presence: true

  def self.load_example!
    user = User.load_example!
    return Event.create! user_id: user.id,
                         name: 'Dystopia Rising SoCal 2017 August',
                         address: '14600 Baron Dr, Eastvale, CA',
                         time_start: '2017 Aug 18 20:00'
  end
end
