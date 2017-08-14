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

  def edit
    p_name = params[:name].to_sym
    p_value = p_name == :time_start ? Time.at(params[:value].to_i) : params[:value]

    Event.find(params[:pk].to_i).update_attributes!(p_name => p_value)
    render json: { success: true }
  end
end
