const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async createThreadWithComment(threadId, commentId) {
    const threadQuery = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [threadId, 'user-12345', 'judul', 'badan', 'date-12345'],
    };
    const threadResult = await pool.query(threadQuery);

    const commentQuery = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [commentId, 'user-12345', threadResult.rows[0].id, 'konten', false, 'date-12345'],
    };
    const commentResult = await pool.query(commentQuery);

    return { threadId: threadResult.rows[0].id, commentId: commentResult.rows[0].id };
  },
  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
    await pool.query('DELETE FROM comments WHERE 1=1');
    await pool.query('DELETE FROM threads WHERE 1=1');
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
