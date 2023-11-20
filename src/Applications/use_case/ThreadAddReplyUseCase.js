const NewReply = require('../../Domains/threads/entities/NewReply');

class ThreadAddReplyUseCase {
    constructor({threadRepository}) {
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      const newReply = new NewReply(useCasePayload);
      const commentId = await this.threadRepository.addReply(
        newReply.userId, newReply.commentId, newReply.content, newReply.date);

      return commentId;
    }
}
  
module.exports = ThreadAddReplyUseCase;
