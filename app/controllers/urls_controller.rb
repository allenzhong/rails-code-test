class UrlsController < ApplicationController
  def index
    @urls = Url.all.order(created_at: :desc)
    respond_to do |format|
      format.html
      format.json {render json: @urls}
    end
  end

  # this action is only for synchronizing urls from db
  def load
    @urls = Url.all.order(created_at: :desc)
    render partial: "url", collection: @urls
  end

  def create
    @url = Url.new(url_params)
    respond_to do |format|
      if @url.save
        format.json {render json: @url}
      end
    end
  end

  private
  def url_params
    params.require(:url).permit(:url)
  end
end
