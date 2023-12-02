const NewReply = require('../../Domains/replies/entities/NewReply');

class ReplyAddUseCase {
    constructor({threadRepository, commentRepository, replyRepository, authenticationTokenManager}) {
      this.threadRepository = threadRepository;
      this.commentRepository = commentRepository;
      this.replyRepository = replyRepository;
      this.authenticationTokenManager = authenticationTokenManager;
    }
  
    async execute(useCasePayload) {
      const {username, id } = await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
      useCasePayload.userId = id;

      await this.threadRepository.verifyThreadExist(useCasePayload.threadId);
      await this.commentRepository.verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);

      const newReply = new NewReply(useCasePayload);

      const replyId = await this.replyRepository.addReply(
        newReply.userId, newReply.commentId, newReply.content);

        return {id : replyId, content : newReply.content, owner : username};
    }
}
  
module.exports = ReplyAddUseCase;
