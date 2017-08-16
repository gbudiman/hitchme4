class Trip < ApplicationRecord
  belongs_to :user
  validates :user, presence: true

  belongs_to :event
  validates :event, presence: true

  validates :encoded_polylines, presence: true
  validates :time_start, presence: true
  validates :address, presence: true
  validates :space_passenger, presence: true
  validates :space_cargo, presence: true

  enum trip_types: [ :to_event, :to_home ]

  def self.load_example!
    event = Event.load_example!
    user = User.find(event.user_id)

    return Trip.create! user_id: user.id,
                        event_id: event.id,
                        encoded_polylines: '842|3513|341|16',
                        time_start: '2017 Aug 18 14:00',
                        address: 'Los Angeles, CA',
                        space_passenger: 2,
                        space_cargo: 2,
                        trip_type: Trip.trip_types[:to_event]
  end

  def self.offer params:, user_id:
    event_id = params[:event_id].to_i
    to_event_saved = false
    to_home_saved = false

    if params[:to_event_address].strip.length > 0
      trip = Trip.find_or_initialize_by(user_id: user_id,
                                        event_id: event_id,
                                        trip_type: Trip.trip_types[:to_event])

      trip.tap do |t|
        t.encoded_polylines = 'dummy'
        t.address = params[:to_event_address]
        t.time_start = Time.at(params[:to_event_time].to_i)
        t.space_passenger = params[:to_event_passenger_space].to_i
        t.space_cargo = 0
      end

      trip.save!
      to_event_saved = true
    end

    if params[:to_home_address].strip.length > 0
      trip = Trip.find_or_initialize_by(user_id: user_id,
                                        event_id: event_id,
                                        trip_type: Trip.trip_types[:to_home])

      trip.tap do |t|
        t.encoded_polylines = 'dummy'
        t.address = params[:to_home_address]
        t.time_start = Time.at(params[:to_home_time].to_i)
        t.space_passenger = params[:to_home_passenger_space].to_i
        t.space_cargo = 0
      end

      trip.save!
      to_home_saved = true
    end

    return {
      success: true,
      to_home_saved: to_home_saved,
      to_event_saved: to_event_saved
    }
  end

  def self.smart_query user_id:, event_id:
    result = {}

    Trip.where(user_id: user_id, event_id: event_id).each do |r|
      trip_type = trip_types.keys[r.trip_type]
      result[trip_type] = {
        address: r.address,
        time_start: r.time_start,
        encoded_polylines: r.encoded_polylines,
        event_id: r.event_id,
        id: r.id,
        space_passenger: r.space_passenger
      }
    end

    return result
  end

  def assign_passenger passenger, pickup_time:
    passenger.trip_id = self.id
    passenger.driver_id = self.user_id
    passenger.pickup_time = pickup_time
    passenger.save!
  end
end
