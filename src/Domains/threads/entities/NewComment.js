class NewComment {
    constructor(payload) {
      this.userId = payload.userId;
      this.threadId = payload.threadId;
      this.content = payload.content;
      this.date = payload.date;

      this.verifyPayload(payload);
    }
  
    verifyPayload(payload) {
      const { userId, threadId, content, date} = payload;
  
      if (!userId || !threadId || !content || !date) {
        throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string' || typeof date !== 'string') {
        throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
}

module.exports = NewComment;
