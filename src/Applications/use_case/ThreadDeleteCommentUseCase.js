class ThreadDeleteCommentUseCase {
    constructor({threadRepository, authenticationTokenManager}) {
      this.threadRepository = threadRepository;
      this.authenticationTokenManager = authenticationTokenManager;
    }
  
    async execute(useCasePayload) {
      const {username, id } = await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
      useCasePayload.userId = id;

      await this.threadRepository.verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);
      await this.threadRepository.verifyCommentOwner(useCasePayload.userId, useCasePayload.commentId);
      await this.threadRepository.deleteComment(useCasePayload.commentId);
    }
}
  
module.exports = ThreadDeleteCommentUseCase;
