class ThreadDeleteCommentUseCase {
    constructor({threadRepository}) {
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      await this.threadRepository.verifyCommentOwner(useCasePayload.userId, useCasePayload.commentId);
      await this.threadRepository.deleteComment(useCasePayload.commentId);
    }
}
  
module.exports = ThreadDeleteCommentUseCase;
