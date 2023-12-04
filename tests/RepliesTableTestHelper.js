const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async createThreadWithComment() {
        const threadQuery = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: ['thread-12345', 'user-12345', 'judul', 'badan', 'date-12345'],
        };
        const threadResult = await pool.query(threadQuery);

        const commentQuery = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: ['comment-12345', 'user-12345', threadResult.rows[0].id, 'konten', false, 'date-12345'],
        };
        const commentResult = await pool.query(commentQuery);

        return {threadId : threadResult.rows[0].id, commentId : commentResult.rows[0].id};
    },
    async getComments(threadId) {
        const query = {
            text: `SELECT comments.id,username,comments.date,content,deleted FROM comments 
                LEFT JOIN users ON comments.user_id = users.id where thread_id = $1 ORDER BY comments.date`,
            values: [threadId],
        };
        const result = await pool.query(query);

        // loop membaca replies
        for(const row of result.rows) {
            
            const replyQuery = {
                text: `SELECT replies.id,username,replies.date,content,deleted FROM replies 
                    LEFT JOIN users ON replies.user_id = users.id where comment_id = $1 ORDER BY replies.date`,
                values: [row.id],
            };
            const replyResult = await pool.query(replyQuery);

            row.replies = replyResult.rows;
        }
        
        return result.rows;
    },
    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
        await pool.query('DELETE FROM comments WHERE 1=1');
        await pool.query('DELETE FROM threads WHERE 1=1');
        await pool.query('DELETE FROM users WHERE 1=1');
    }
};

module.exports = RepliesTableTestHelper;
