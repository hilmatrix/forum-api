const InvariantError = require('../../../Commons/exceptions/InvariantError');

class NewComment {
  constructor(payload) {
    this.userId = payload.userId;
    this.threadId = payload.threadId;
    this.content = payload.content;
    this.date = payload.date;

    this.verifyPayload(payload);
  }

  verifyPayload(payload) {
    const { userId, threadId, content } = payload;

    if (!userId || !threadId || !content) {
      throw new InvariantError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new InvariantError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
