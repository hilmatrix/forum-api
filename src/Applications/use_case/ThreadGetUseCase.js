const InvariantError = require('../../Commons/exceptions/InvariantError');

class ThreadGetUseCase {
    constructor({threadRepository}) {
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      const thread = await this.threadRepository.threadGet(useCasePayload.threadId);
      const { username } = await this.threadRepository.threadGetUsername(thread.user_id)
      const comments = await this.threadRepository.threadGetComments(useCasePayload.threadId)
      
      if (comments)
        for(const comment of comments) {
          if (comment.deleted) {
            comment.content = '**komentar telah dihapus**';
          }

          if (comment.replies)
            for(const reply of comment.replies) {
              if (reply.deleted) {
                reply.content = '**balasan telah dihapus**';
              }
            }
          else
            throw new InvariantError('Terjadi kegagalan di server kami');
        }
      else
       throw new InvariantError('Terjadi kegagalan di server kami');

      return {id : thread.id, title : thread.title, body : thread.body, 
        date : thread.date, username, comments};
    }
}
  
module.exports = ThreadGetUseCase;
