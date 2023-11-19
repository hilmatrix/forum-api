class NewComment {
    constructor(payload) {
      this.userId = payload.userId;
      this.commentId = payload.commentId;
      this.content = payload.content;
      this.date = payload.date;

      this.verifyPayload(payload);
    }
  
    verifyPayload(payload) {
      const { userId, commentId, content, date} = payload;
  
      if (!userId || !commentId || !content || !date) {
        throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof userId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string' || typeof date !== 'string') {
        throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
}

module.exports = NewComment;
