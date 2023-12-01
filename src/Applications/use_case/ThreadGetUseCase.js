class ThreadGetUseCase {
    constructor({threadRepository}) {
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      const thread = await this.threadRepository.threadGet(useCasePayload.threadId);
      const { username } = await this.threadRepository.threadGetUsername(thread.user_id)
      const comments = await this.threadRepository.threadGetComments(useCasePayload.threadId)

      return {id : thread.id, title : thread.title, body : thread.body, 
        date : thread.date, username, comments};
    }
}
  
module.exports = ThreadGetUseCase;
