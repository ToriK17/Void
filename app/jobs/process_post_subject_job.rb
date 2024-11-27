class ProcessPostSubjectJob < ApplicationJob
  include Categories
  queue_as :default

  def perform(post_id)
    post = Post.find(post_id)

    result = TRANSFORMERS_PIPELINE.call(post.content, candidate_labels: Categories::LIST)
    subject = result['labels'][0]

    post.update(subject: subject)
  end
end
