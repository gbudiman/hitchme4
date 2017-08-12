require 'rails_helper'

RSpec.describe Event, type: :model do
  context 'Creation' do
    before :each do
      @event = Event.load_example!
    end

    it 'should be created successfully' do
      expect(@event).not_to be_nil
    end
  end
end
