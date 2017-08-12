require 'rails_helper'

RSpec.describe Passenger, type: :model do
  before :each do
    @count = 3
    pex = Passenger.load_example! count: @count
    @trip = pex[:trip]
    @passengers = pex[:passengers]
  end

  context 'looking for ride' do
    it 'should be created successfuly' do
      expect(@passengers.length).to eq(@count)
    end
  end

  context 'being assigned to existing trip' do
    it 'using Passenger.assign_to method' do
      @passengers.each do |passenger|
        passenger.assign_trip @trip, pickup_time: '2017 Aug 18 15:00'
      end

      @passengers.each do |passenger|
        expect(passenger.is_assigned_to_trip?).to eq(true)
      end
    end

    it 'using Trip.assign_passengers method' do
      @passengers.each do |passenger|
        @trip.assign_passenger passenger, pickup_time: '2017 Aug 18 15:00'
      end

      @passengers.each do |passenger|
        expect(passenger.is_assigned_to_trip?).to eq(true)
      end
    end
  end
end
