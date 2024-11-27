require 'pycall/import'
include PyCall::Import
include Categories

class Api::V1::PostsController < ApplicationController
  
  def index
    # @posts = Post.where('created_at >= ?', 2.hours.ago)
    @posts = Post.all
    render json: @posts
  end

  def create
    @post = Post.new(post_params)
    result = TRANSFORMERS_PIPELINE.call(@post.content, candidate_labels: Categories::LIST)
    if @post.save
      ProcessPostSubjectJob.perform_later(@post.id)
      render json: { post: @post, message: 'Post created successfully. Subject will be updated shortly.' }
    else
      render json: { error: 'Failed to create post' }, status: :unprocessable_entity
    end
  end

  def update
    @post = Post.find(params[:id])
    if @post.update(public: true)
      render json: @post
    else
      render json: { error: 'Failed to update post' }, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.require(:post).permit(:content)
  end
end
