class UrlsController < ApplicationController
  def index
  end

  def create
    @url = Url.new(url_params)

    respond_to do |format|
       if @url.save
         format.js
       else
         format.js
       end
    end
  end

  private
  def url_params
    params.require(:url).permit(:url)
  end
end
