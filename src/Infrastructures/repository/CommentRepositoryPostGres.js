const CommentRepository = require('../../Domains/comments/CommentRepository');
const { nanoid } = require('nanoid');
const moment = require('moment');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class CommentRepositoryPostGres extends CommentRepository {
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

    async addComment(userId, threadId, content) {
        const commentId = this.generateId('comment');

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [commentId, userId, threadId, content, false, this.generateDate()],
        };
        const result = await this.pool.query(query);
      
        return result.rows[0].id;
    }

    async verifyCommentExist(threadId, commentId) {
        const query = {
            text: 'SELECT * FROM comments where id = $1 AND thread_id = $2',
            values: [commentId, threadId],
        };
        const result = await this.pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('Comment tidak ditemukan');
        }
    }

    async verifyCommentOwner(userId, commentId) {
        const query = {
            text: 'SELECT * FROM comments where id = $1 AND user_id = $2',
            values: [commentId, userId],
        };
        const result = await this.pool.query(query);

        if (result.rows.length === 0) {
            throw new AuthorizationError('Akses comment ditolak');
        }
    }

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET deleted = true WHERE id = $1 RETURNING id',
            values: [commentId],
        };
        const result = await this.pool.query(query);

        if (result.rows.length === 0) {
            throw new InvariantError('Komen gagal dihapus');
        }
    }
}

module.exports = CommentRepositoryPostGres;
