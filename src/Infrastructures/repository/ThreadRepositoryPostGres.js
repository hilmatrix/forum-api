const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const { nanoid } = require('nanoid');
const moment = require('moment');

const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
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

        if (result.rows.length === 0) {
            throw new InvariantError('Thread gagal ditambahkan');
        }
      
        return result.rows[0].id;
    }

    async getThread(threadId) {
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

    async addComment(userId, threadId, content) {
        const commentId = this.generateId('comment');

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [commentId, userId, threadId, content, false, this.generateDate()],
        };
        const result = await this.pool.query(query);

        if (result.rows.length === 0) {
            throw new InvariantError('Comment gagal ditambahkan');
        }
      
        return result.rows[0].id;
    }

    async verifyCommentOwner(userId, commentId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteComment(commentId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async addReply(userId, commentId, content, date) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyReplyOwner(userId, replyId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteReply(replyId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
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
            throw new NotFoundError('User pada thread poster tidak ditemukan');
        }
      
        return result.rows[0];
    }

    async threadGetComments(threadId) {
        const query = {
            text: 'SELECT comments.id,username,comments.date,content FROM comments LEFT JOIN users ON comments.user_id = users.id where thread_id = $1',
            values: [threadId],
        };
        const result = await this.pool.query(query);
      
        return result.rows;
    }
}

module.exports = ThreadRepositoryPostgres;