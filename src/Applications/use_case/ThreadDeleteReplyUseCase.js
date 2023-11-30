class ThreadDeleteReplyUseCase {
    constructor({threadRepository, authenticationTokenManager}) {
      this.threadRepository = threadRepository;
      this.authenticationTokenManager = authenticationTokenManager;
    }
  
    async execute(useCasePayload) {
      const {username, id } = await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
      useCasePayload.userId = id;

      await this.threadRepository.verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);
      await this.threadRepository.verifyReplyExist(useCasePayload.commentId, useCasePayload.replyId);
      await this.threadRepository.verifyReplyOwner(useCasePayload.userId, useCasePayload.replyId);
      await this.threadRepository.deleteReply(useCasePayload.replyId);
    }
}
  
module.exports = ThreadDeleteReplyUseCase;
