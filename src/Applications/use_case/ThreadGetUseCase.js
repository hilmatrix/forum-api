const InvariantError = require('../../Commons/exceptions/InvariantError');

class ThreadGetUseCase {
    constructor({threadRepository, commentRepository, replyRepository, likeRepository}) {
      this.threadRepository = threadRepository;
      this.commentRepository = commentRepository;
      this.replyRepository = replyRepository;
      this.likeRepository = likeRepository;
    }
  
    async execute(useCasePayload) {
      const thread = await this.threadRepository.threadGet(useCasePayload.threadId);
      const comments = await this.commentRepository.getComments(useCasePayload.threadId)
      
      if (comments) {
        for(const comment of comments) {
          comment.replies = await this.replyRepository.getReplies(comment.id);

          const likes = await this.likeRepository.getAllLikes(comment.id)
          comment.likeCount = likes.length

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
      }
      else
       throw new InvariantError('Terjadi kegagalan di server kami');

      return {id : thread.id, title : thread.title, body : thread.body, 
        date : thread.date, username : thread.username, comments};
    }
}
  
module.exports = ThreadGetUseCase;
