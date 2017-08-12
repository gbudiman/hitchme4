require 'rails_helper'

RSpec.describe Trip, type: :model do
  context 'creation' do
    before :each do
      @trip = Trip.load_example!
    end

    it 'should be saved successfully' do 
      expect(@trip).not_to be_nil
    end
  end
end
