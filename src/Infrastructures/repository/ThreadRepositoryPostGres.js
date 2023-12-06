const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const { nanoid } = require('nanoid');
const moment = require('moment');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');


class ThreadRepositoryPostGres extends ThreadRepository {
    constructor(pool) {
      super();

      this.pool = pool;
      this.generateId = this.generateId;
      this.generateDate = this.generateDate;
    }

    generateId(prefix) {
        return `${prefix}-${nanoid(16)}`;
    }

    generateDate() {
        return moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
    }

    async createThread(userId, title, body) {
        const threadId = this.generateId('thread');
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [threadId, userId, title, body, this.generateDate()],
        };
        const result = await this.pool.query(query);
      
        return result.rows[0].id;
    }

    async threadGet(threadId) {
        const query = {
            text: `SELECT threads.id,title,body,date,username FROM threads
                LEFT JOIN users ON threads.user_id = users.id where threads.id = $1`,
            values: [threadId],
        };
        const result = await this.pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('Thread tidak ditemukan');
        }
      
        return result.rows[0];
    }

    async verifyThreadExist(threadId) {
        const query = {
            text: 'SELECT * FROM threads where id = $1',
            values: [threadId],
        };
        const result = await this.pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('Thread gagal ditemukan');
        }
    }
}

module.exports = ThreadRepositoryPostGres;