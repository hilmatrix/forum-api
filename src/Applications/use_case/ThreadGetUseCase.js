class ThreadGetUseCase {
    constructor({threadRepository}) {
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      const thread = await this.threadRepository.getThread(useCasePayload.threadId);
      return thread;
    }
}
  
module.exports = ThreadGetUseCase;
