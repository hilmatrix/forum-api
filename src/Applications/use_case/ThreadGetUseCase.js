class ThreadGetUseCase {
    constructor({threadRepository}) {
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      const thread = await this.threadRepository.getThread(useCasePayload.threadId);
      const { username } = await this.threadRepository.threadGetUsername(thread.user_id)
      const comments = await this.threadRepository.threadGetComments(useCasePayload.threadId)

      function compareDate( a, b ) {
        if ( a.date < b.date ){
          return -1;
        }
        if ( a.date > b.date ){
          return 1;
        }
        return 0;
      }

      comments.sort(compareDate)

      return {id : thread.id, title : thread.title, body : thread.body, 
        date : thread.id, data : [], username, comments};
    }
}
  
module.exports = ThreadGetUseCase;
