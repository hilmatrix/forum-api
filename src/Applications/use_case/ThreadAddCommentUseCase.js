const NewComment = require('../../Domains/threads/entities/NewComment');

class ThreadAddCommentUseCase {
    constructor({threadRepository}) {
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      const newComment = new NewComment(useCasePayload);
      const commentId = await this.threadRepository.addComment(
        newComment.userId, newComment.threadId, newComment.content, newComment.date);

      return commentId;
    }
}
  
module.exports = ThreadAddCommentUseCase;
