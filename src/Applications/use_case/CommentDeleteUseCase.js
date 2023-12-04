const InvariantError = require('../../Commons/exceptions/InvariantError');

class CommentDeleteUseCase {
    constructor({commentRepository}) {
      this.commentRepository = commentRepository;
    }
  
    async execute(useCasePayload) {
      await this.commentRepository.verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);
      await this.commentRepository.verifyCommentOwner(useCasePayload.userId, useCasePayload.commentId);
      await this.commentRepository.deleteComment(useCasePayload.commentId);
    }
}
  
module.exports = CommentDeleteUseCase;
