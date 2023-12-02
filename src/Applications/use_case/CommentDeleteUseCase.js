class CommentDeleteUseCase {
    constructor({commentRepository, authenticationTokenManager}) {
      this.commentRepository = commentRepository;
      this.authenticationTokenManager = authenticationTokenManager;
    }
  
    async execute(useCasePayload) {
      const {username, id } = await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
      useCasePayload.userId = id;

      await this.commentRepository.verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);
      await this.commentRepository.verifyCommentOwner(useCasePayload.userId, useCasePayload.commentId);
      await this.commentRepository.deleteComment(useCasePayload.commentId);
    }
}
  
module.exports = CommentDeleteUseCase;
