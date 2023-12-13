const NewReply = require('../../Domains/replies/entities/NewReply');

class ReplyAddUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this.threadRepository
      .verifyThreadExist(useCasePayload.threadId);
    await this.commentRepository
      .verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);
    const newReply = new NewReply(useCasePayload);
    const replyId = await this.replyRepository
      .addReply(newReply.userId, newReply.commentId, newReply.content);
    return { id: replyId, content: newReply.content, owner: useCasePayload.username };
  }
}

module.exports = ReplyAddUseCase;
