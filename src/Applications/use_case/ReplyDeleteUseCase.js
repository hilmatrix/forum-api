class ReplyDeleteUseCase {
  constructor({ commentRepository, replyRepository }) {
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this.commentRepository
      .verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);
    await this.replyRepository
      .verifyReplyExist(useCasePayload.commentId, useCasePayload.replyId);
    await this.replyRepository
      .verifyReplyOwner(useCasePayload.userId, useCasePayload.replyId);
    await this.replyRepository
      .deleteReply(useCasePayload.replyId);
  }
}

module.exports = ReplyDeleteUseCase;
