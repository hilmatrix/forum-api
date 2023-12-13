const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentAddUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this.threadRepository.verifyThreadExist(useCasePayload.threadId);
    const newComment = new NewComment(useCasePayload);
    const commentId = await this.commentRepository
      .addComment(newComment.userId, newComment.threadId, newComment.content);
    return { id: commentId, content: newComment.content, owner: useCasePayload.username };
  }
}

module.exports = CommentAddUseCase;
