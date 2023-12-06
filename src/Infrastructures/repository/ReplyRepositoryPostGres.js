const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const { nanoid } = require('nanoid');
const moment = require('moment');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class ReplyRepositoryPostGres extends ReplyRepository {
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

    async addReply(userId, commentId, content) {
        const replyId = this.generateId('reply');
    
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [replyId, userId, commentId, content, false, this.generateDate()],
        };
        const result = await this.pool.query(query);
      
        return result.rows[0].id;
    }
    
    async verifyReplyExist(commentId, replyId) {
        const query = {
            text: 'SELECT * FROM replies where id = $1 AND comment_id = $2',
            values: [replyId, commentId],
        };
        const result = await this.pool.query(query);
    
        if (result.rows.length === 0) {
            throw new NotFoundError('Reply tidak ditemukan');
        }
    }
    
    async verifyReplyOwner(userId, replyId) {
        const query = {
            text: 'SELECT * FROM replies where id = $1 AND user_id = $2',
            values: [replyId, userId],
        };
        const result = await this.pool.query(query);
    
        if (result.rows.length === 0) {
            throw new AuthorizationError('Akses reply ditolak');
        }
    }
    
    async deleteReply(replyId) {
        const query = {
            text: 'UPDATE replies SET deleted = true WHERE id = $1 RETURNING id',
            values: [replyId],
        };
        const result = await this.pool.query(query);
    
        if (result.rows.length === 0) {
            throw new InvariantError('Reply gagal dihapus');
        }
    }

    async getReplies(commentId) {
        const replyQuery = {
            text: `SELECT replies.id,username,replies.date,content,deleted FROM replies 
                LEFT JOIN users ON replies.user_id = users.id where comment_id = $1 ORDER BY replies.date`,
            values: [commentId],
        };
        const replyResult = await this.pool.query(replyQuery);

        return replyResult.rows;
    }
}

module.exports = ReplyRepositoryPostGres;
