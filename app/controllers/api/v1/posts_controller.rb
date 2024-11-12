require 'pycall/import'
include PyCall::Import


class Api::V1::PostsController < ApplicationController
  
  CATEGORIES = [
    "Personal",
    "Relationships",
    "Mental",
    "Career",
    "Finances",
    "Health",
    "Goals",
    "Life",
    "Personal",
    "Existential",
    "Social",
    "Fear",
    "Injustice",
    "Social",
    "Environmental",
    "Political",
    "Cultural",
    "Societal",
    "Media",
    "Technology",
    "Technology",
    "Social",
    "Digital",
    "Privacy",
    "Technological",
    "Virtual",
    "Personal",
    "Creative",
    "Sports",
    "Hobbies",
    "Travel",
    "Gaming",
    "Everyday",
    "Traffic",
    "Public",
    "Weather",
    "Customer",
    "Waiting",
    "Miscellaneous",
    "Mishaps",
    "Irrational",
    "Regret",
    "Overthinking",
    "Procrastination",
    "Impatience",
    "Exhaustion",
    "Lack",
    "Anger",
    "Feeling",
    "Trump",
    "Kamala",
    "Democrats",
    "Republicans",
    "Life",
    "Election",
    "School",
    "Test",
    "Future",
    "Past",
]
  def index
    # @posts = Post.where('created_at >= ?', 2.hours.ago)
    @posts = Post.all
    render json: @posts
  end

  def create
    pyimport 'transformers', as: :transformers
    keyword_extractor = transformers.pipeline('zero-shot-classification', model: 'facebook/bart-large-mnli')

    @post = Post.new(post_params)

    if @post.save
      result = keyword_extractor.call(@post.content, candidate_labels: CATEGORIES)
      subject = result['labels'][0]

      # Update the subject to the parsed AI subject in the db
      @post.update(subject: subject)

      render json: { post: @post, subject: subject }
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
