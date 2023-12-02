const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentAddUseCase {
    constructor({threadRepository, commentRepository, authenticationTokenManager}) {
      this.threadRepository = threadRepository;
      this.commentRepository = commentRepository;
      this.authenticationTokenManager = authenticationTokenManager;
    }
  
    async execute(useCasePayload) {
      const {username, id } = await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
      useCasePayload.userId = id;

      await this.threadRepository.verifyThreadExist(useCasePayload.threadId);

      const newComment = new NewComment(useCasePayload);

      const commentId = await this.commentRepository.addComment(
        newComment.userId, newComment.threadId, newComment.content);

      return {id : commentId, content : newComment.content, owner : username};
    }
}
  
module.exports = CommentAddUseCase;
