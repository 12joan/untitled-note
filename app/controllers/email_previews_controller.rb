class EmailPreviewsController < ApplicationController
  before_action :set_email_preview, only: %i[show]

  # GET /email_previews
  def index
    @email_previews = EmailPreview.where(to: params.fetch(:to))
  end

  # GET /email_previews/1
  def show
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_email_preview
    @email_preview = EmailPreview.find(params[:id])
  end
end
