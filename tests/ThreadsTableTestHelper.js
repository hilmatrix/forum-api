const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addCommentAndReply(threadId) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: ['comment-12345', 'user-hilmatrix', threadId, 'konten', false, 'date-12345'],
        };
        await pool.query(query);
    },
    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
        await pool.query('DELETE FROM comments WHERE 1=1');
        await pool.query('DELETE FROM threads WHERE 1=1');
        await pool.query('DELETE FROM users WHERE 1=1');
    }
};

module.exports = ThreadsTableTestHelper;