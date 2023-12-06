const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async createThread() {
        const threadQuery = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: ['thread-12345', 'hilmatrix', 'judul', 'badan', 'date-12345'],
        };
        const threadResult = await pool.query(threadQuery);

        return threadResult.rows[0].id;
    },
    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
        await pool.query('DELETE FROM comments WHERE 1=1');
        await pool.query('DELETE FROM threads WHERE 1=1');
        await pool.query('DELETE FROM users WHERE 1=1');
    }
};

module.exports = CommentsTableTestHelper;
