const InvariantError = require('../../../Commons/exceptions/InvariantError');

class NewThread {
    constructor(payload) {
      this.userId = payload.userId;
      this.title = payload.title;
      this.body = payload.body;

      this.verifyPayload(payload);
    }
  
    verifyPayload(payload) {
      const { userId, title, body} = payload;
  
      if (!userId || !title || !body) {
        throw new InvariantError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
        throw new InvariantError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
}

module.exports = NewThread;
