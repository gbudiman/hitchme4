class OffersController < ApplicationController
  def post
    render json: Trip.offer(params: params, user_id: current_user[:id])
  end

  def current
    event_id = params[:event_id].to_i
    render json: Trip.smart_query(user_id: current_user[:id], event_id: event_id)
  end

  def delete
    Trip.find(params[:id].to_i).destroy!
    render json: { success: true }
  end
end
