const InvariantError = require('../../../Commons/exceptions/InvariantError');

class NewComment {
  constructor(payload) {
    this.userId = payload.userId;
    this.commentId = payload.commentId;
    this.content = payload.content;
    this.date = payload.date;

    this.verifyPayload(payload);
  }

  verifyPayload(payload) {
    const { userId, commentId, content } = payload;

    if (!userId || !commentId || !content) {
      throw new InvariantError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string') {
      throw new InvariantError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
