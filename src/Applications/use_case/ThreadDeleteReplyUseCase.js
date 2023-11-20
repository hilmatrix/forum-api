class ThreadDeleteReplyUseCase {
    constructor({threadRepository}) {
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      await this.threadRepository.verifyReplyOwner(useCasePayload.userId, useCasePayload.replyId);
      await this.threadRepository.deleteReply(useCasePayload.replyId);
    }
}
  
module.exports = ThreadDeleteReplyUseCase;
