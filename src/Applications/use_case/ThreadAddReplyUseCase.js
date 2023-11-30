const NewReply = require('../../Domains/threads/entities/NewReply');

class ThreadAddReplyUseCase {
    constructor({threadRepository, authenticationTokenManager}) {
      this.threadRepository = threadRepository;
      this.authenticationTokenManager = authenticationTokenManager;
    }
  
    async execute(useCasePayload) {
      const {username, id } = await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
      useCasePayload.userId = id;

      await this.threadRepository.verifyThreadExist(useCasePayload.threadId);
      await this.threadRepository.verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);

      const newReply = new NewReply(useCasePayload);

      const replyId = await this.threadRepository.addReply(
        newReply.userId, newReply.commentId, newReply.content);

        return {id : replyId, content : newReply.content, owner : username};
    }
}
  
module.exports = ThreadAddReplyUseCase;
