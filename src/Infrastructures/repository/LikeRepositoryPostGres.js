const LikeRepository = require('../../Domains/likes/LikeRepository');
const { nanoid } = require('nanoid');

class LikeRepositoryPostGres extends LikeRepository {
    constructor(pool) {
      super();

      this.pool = pool;
      this.generateId = this.generateId;
    }

    generateId(prefix) {
        return `${prefix}-${nanoid(16)}`;
    }

    async getAllLikes(commentId) {
      const query = {
        text: `SELECT * FROM likes WHERE comment_id = $1`,
        values: [commentId],
      };
      const result = await this.pool.query(query);

      return result.rows;
    }

    async getLike(userId, commentId) {
        const query = {
          text: `SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2`,
          values: [commentId, userId],
        };
        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async addLike(userId, commentId) {
        const likeId = this.generateId('like');

        const query = {
          text: `INSERT INTO likes VALUES($1, $2, $3) RETURNING id`,
          values: [likeId, userId, commentId],
        };
        const result = await this.pool.query(query);
      
        return result.rows[0].id
    }

    async removeLike(userId, commentId) {
        const query = {
          text: `DELETE FROM likes where user_id = $1 and comment_id = $2 RETURNING id`,
          values: [userId, commentId],
        };
        const result = await this.pool.query(query);
      
        return result.rows[0].id
    }
}

module.exports = LikeRepositoryPostGres;
