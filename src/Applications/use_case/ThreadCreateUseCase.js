const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadCreateUseCase {
    constructor({threadRepository}) {
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      const newThread = new NewThread(useCasePayload);
      const threadId = await this.threadRepository.createThread(
        newThread.userId, newThread.title, newThread.body, newThread.date);

      return threadId;
    }
}
  
module.exports = ThreadCreateUseCase;
