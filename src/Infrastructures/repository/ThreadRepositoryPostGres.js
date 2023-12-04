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
            text: 'SELECT * FROM threads where id = $1',
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

    async threadGetUsername(userId) {

        const query = {
            text: 'SELECT * FROM users where id = $1',
            values: [userId],
        };
        const result = await this.pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('User tidak ditemukan');
        }
      
        return result.rows[0];
    }

    async threadGetComments(threadId) {
        const query = {
            text: `SELECT comments.id,username,comments.date,content,deleted FROM comments 
                LEFT JOIN users ON comments.user_id = users.id where thread_id = $1 ORDER BY comments.date`,
            values: [threadId],
        };
        const result = await this.pool.query(query);

        // loop membaca replies
        for(const row of result.rows) {
            
            const replyQuery = {
                text: `SELECT replies.id,username,replies.date,content,deleted FROM replies 
                    LEFT JOIN users ON replies.user_id = users.id where comment_id = $1 ORDER BY replies.date`,
                values: [row.id],
            };
            const replyResult = await this.pool.query(replyQuery);

            row.replies = replyResult.rows;
        }
        
        return result.rows;
    }
}

module.exports = ThreadRepositoryPostGres;