const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadCreateUseCase {
    constructor({threadRepository, authenticationTokenManager}) {
      this.threadRepository = threadRepository;
      this.authenticationTokenManager = authenticationTokenManager;
    }
  
    async execute(useCasePayload) {
      const { username, id } = await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
      useCasePayload.userId = id;

      const newThread = new NewThread(useCasePayload);
      const threadId = await this.threadRepository.createThread(
        newThread.userId, newThread.title, newThread.body);

      return {id : threadId, title : newThread.title, owner : username};
    }
}
  
module.exports = ThreadCreateUseCase;
