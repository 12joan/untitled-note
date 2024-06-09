class Admin::UsersController < ApplicationController
  layout 'admin'

  before_action :require_admin
  before_action :set_user, only: %i[ show edit update destroy ]

  # GET /admin/users
  def index
    @users = User.all.order(admin: :desc, created_at: :asc)
  end

  # GET /admin/users/1
  def show
  end

  # GET /admin/users/new
  def new
    @user = User.new
  end

  # GET /admin/users/1/edit
  def edit
  end

  # POST /admin/users
  def create
    @user = User.new(user_params)
    @user.skip_confirmation!
    @user.creating_through_admin_page = true

    if @user.save
      @user.send_reset_password_instructions
      @user.projects.create!(name: 'My project')
      redirect_to admin_user_path(@user), notice: 'User was successfully created/User created'
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /admin/users/1
  def update
    @user.skip_reconfirmation!

    if @user.update(user_params)
      redirect_to admin_user_path(@user), notice: 'User was successfully updated/User updated', status: :see_other
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /admin/users/1
  def destroy
    @user.destroy
    redirect_to admin_users_url, notice: 'User was successfully deleted/User deleted', status: :see_other
  end

  private

  def require_admin
    authenticate_user!

    unless current_user.admin?
      redirect_to '/', notice: 'This page is only accessible to admins/Access denied'
    end
  end

  def set_user
    @user = User.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(:email, :admin, :storage_quota_override)
  end
end
