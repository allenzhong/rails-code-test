class Url < ActiveRecord::Base
  # it will be separated into 3 groups
  # 1. schema, 2. domain name 3.suffix
  REGEXP = /\A(https?:\/\/)?([\da-z\.-]+)(\.[a-z\.]{2,6})([\/\w \.-]*)*\/?\z/
  validates_format_of :url, with: REGEXP
  before_save :set_short_url

  private
  def set_short_url
    result = url.match REGEXP
    self.short_url = result[1..result.length].join("") unless result.nil?
  end
end
