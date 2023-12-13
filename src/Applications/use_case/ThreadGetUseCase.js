const InvariantError = require('../../Commons/exceptions/InvariantError');

class ThreadGetUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
    this.likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const thread = await this.threadRepository.threadGet(useCasePayload.threadId);
    const comments = await this.commentRepository.getComments(useCasePayload.threadId);

    if (comments) {
      let i = 0;
      let comment = null;
      while (i < comments.length) {
        comment = comments[i];

        /* eslint-disable no-await-in-loop */
        comment.replies = await this.replyRepository.getReplies(comment.id);

        /* eslint-disable no-await-in-loop */
        const likes = await this.likeRepository.getAllLikes(comment.id);
        comment.likeCount = likes.length;

        if (comment.deleted) {
          comment.content = '**komentar telah dihapus**';
        }

        if (comment.replies) {
          let j = 0;
          let reply = null;
          while (j < comment.replies.length) {
            reply = comment.replies[j];
            if (reply.deleted) {
              reply.content = '**balasan telah dihapus**';
            }
            j += 1;
          }
        } else throw new InvariantError('Terjadi kegagalan di server kami');

        i += 1;
      }
    } else throw new InvariantError('Terjadi kegagalan di server kami');

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments,
    };
  }
}

module.exports = ThreadGetUseCase;
