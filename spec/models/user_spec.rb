require 'rails_helper'

RSpec.describe User, type: :model do
  context 'Linked User creation' do
    before :each do
      @user = User.load_example!
    end

    it 'should create linked user correctly' do
      user_id = @user.id
      expect(Provider.find_by(user_id: user_id)).not_to be_nil
    end

    it 'should be queryable' do
      # NOTE: load_example! appends index 0 at generated UID
      u = User.find_linked provider: :facebook, uid: '852075124612405135130'
      expect(u).not_to be_nil
    end
  end
end
