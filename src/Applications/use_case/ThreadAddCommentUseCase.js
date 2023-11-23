const NewComment = require('../../Domains/threads/entities/NewComment');

class ThreadAddCommentUseCase {
    constructor({threadRepository, authenticationTokenManager}) {
      this.threadRepository = threadRepository;
      this.authenticationTokenManager = authenticationTokenManager;
    }
  
    async execute(useCasePayload) {
      const {username, id } = await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
      useCasePayload.userId = id;

      await this.threadRepository.verifyThreadExist(useCasePayload.threadId);

      const newComment = new NewComment(useCasePayload);

      const commentId = await this.threadRepository.addComment(
        newComment.userId, newComment.threadId, newComment.content);

      return {id : commentId, content : newComment.content, owner : username};
    }
}
  
module.exports = ThreadAddCommentUseCase;
