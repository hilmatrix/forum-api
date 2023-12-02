class ReplyDeleteUseCase {
    constructor({commentRepository, replyRepository, authenticationTokenManager}) {
      this.commentRepository = commentRepository;
      this.replyRepository = replyRepository;
      this.authenticationTokenManager = authenticationTokenManager;
    }
  
    async execute(useCasePayload) {
      const {username, id } = await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
      useCasePayload.userId = id;

      await this.commentRepository.verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);
      await this.replyRepository.verifyReplyExist(useCasePayload.commentId, useCasePayload.replyId);
      await this.replyRepository.verifyReplyOwner(useCasePayload.userId, useCasePayload.replyId);
      await this.replyRepository.deleteReply(useCasePayload.replyId);
    }
}
  
module.exports = ReplyDeleteUseCase;
