class EventsController < ApplicationController
  def fetch
    render json: Event.where(user_id: current_user[:id]).order(time_start: :desc)
  end

  def post
    Event.load_multi user_id: current_user.id, h: params
    render json: { success: true }
  end

  def delete
    Event.find(params[:id].to_i).destroy!
    render json: { success: true }
  end
end
