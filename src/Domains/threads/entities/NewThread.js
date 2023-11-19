class NewThread {
    constructor(payload) {
      this.userId = payload.userId;
      this.title = payload.title;
      this.body = payload.body;
      this.date = payload.date;

      this.verifyPayload(payload);
    }
  
    verifyPayload(payload) {
      const { userId, title, body, date} = payload;
  
      if (!userId || !title || !body || !date) {
        throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'string') {
        throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
}

module.exports = NewThread;
