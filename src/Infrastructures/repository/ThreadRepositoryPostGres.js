const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const { nanoid } = require('nanoid');
const moment = require('moment');

const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');


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

    async addReply(userId, commentId, content) {
        const replyId = this.generateId('reply');

        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [replyId, userId, commentId, content, false, this.generateDate()],
        };
        const result = await this.pool.query(query);

        if (result.rows.length === 0) {
            throw new InvariantError('Reply gagal ditambahkan');
        }
      
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

        // loop membaca replies dan menghapus komen jika dihapus 
        for(const row of result.rows) {
            if (row.deleted) {
                row.content = '**komentar telah dihapus**';
            }
            delete row.deleted;

            const replyQuery = {
                text: `SELECT replies.id,username,replies.date,content,deleted FROM replies 
                    LEFT JOIN users ON replies.user_id = users.id where comment_id = $1 ORDER BY replies.date`,
                values: [row.id],
            };
            const replyResult = await this.pool.query(replyQuery);

            row.replies = replyResult.rows;

            // loop menghapus reply jika dihapus 
            for(const rowReply of row.replies) {
                if (rowReply.deleted) {
                    rowReply.content = '**balasan telah dihapus**';
                }
                delete rowReply.deleted;
            }
        }
        
        return result.rows;
    }
}

module.exports = ThreadRepositoryPostgres;