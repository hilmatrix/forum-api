const ThreadRepositoryPostGres = require('../ThreadRepositoryPostGres');
const CommentRepositoryPostGres = require('../CommentRepositoryPostGres');
const ReplyRepositoryPostGres = require('../ReplyRepositoryPostGres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {

    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
    });
  
    afterAll(async () => {
      await pool.end();
    });

    describe('createThread function', () => {
        it('should return type of string', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            expect(typeof threadId).toBe('string')
        });
    });

    describe('verifyThreadExist function', () => {
        it('should throw NotFoundError if not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            await expect(threadRepositoryPostgres.verifyThreadExist('thread-xxx')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError if thread exist', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            await expect(threadRepositoryPostgres.verifyThreadExist(threadId)).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('threadGet function', () => {
        it('should not throw NotFoundError if thread is not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            await expect(threadRepositoryPostgres.threadGet('thread-xxx')).rejects.toThrowError(NotFoundError);
        });

        it('should return thread correctly', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const thread = await threadRepositoryPostgres.threadGet(threadId);

            expect(typeof thread).toBe('object')
        });
    });

    describe('addComment function', () => {
        it('should return type of string', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            expect(typeof commentId).toBe('string')
        });
    });

    describe('verifyCommentExist function', () => {
        it('should throw NotFoundError if threadId not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            await expect(commentRepositoryPostGres.verifyCommentExist('thread-xxx', commentId)).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError if thread and comment exist', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            await expect(commentRepositoryPostGres.verifyCommentExist(threadId, commentId)).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('addReply function', () => {
        it('should return type of string', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            expect(typeof replyId).toBe('string')
        });
    });

    describe('verifyReplyExist function', () => {
        it('should throw NotFoundError if commentId not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            await expect(replyRepositoryPostGres.verifyReplyExist('comment-xxx', replyId)).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError if thread, comment and reply exist', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            await expect(replyRepositoryPostGres.verifyReplyExist(commentId, replyId)).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('threadGetComments function', () => {
        it('should return thread comments and replies correctly', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten 1');
            await replyRepositoryPostGres.addReply('user-12345',commentId,'konten 2');
            const comments = await threadRepositoryPostgres.threadGetComments(threadId);

            expect(typeof comments).toBe('object')
            expect(typeof comments[0].replies).toBe('object')
        });
    });

    describe('deleteComment and deleteReply function', () => {
        it('comment deleted should return false at first', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            await commentRepositoryPostGres.addComment('user-12345',threadId,'konten 1');
            const comments = await threadRepositoryPostgres.threadGetComments(threadId);

            expect(comments[0].deleted).toBe(false)
        });

        it('reply deleted should return false at first', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten 1');
            await replyRepositoryPostGres.addReply('user-12345',commentId,'konten 2');
            const comments = await threadRepositoryPostgres.threadGetComments(threadId);

            expect(comments[0].replies[0].deleted).toBe(false)
        });

        it('comment deleted should return true after deleted', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten 1');
            await commentRepositoryPostGres.deleteComment(commentId);
            const comments = await threadRepositoryPostgres.threadGetComments(threadId);

            expect(comments[0].deleted).toBe(true)
        });

        it('reply deleted should return false at first', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten 1');
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten 2');
            await replyRepositoryPostGres.deleteReply(replyId);
            const comments = await threadRepositoryPostgres.threadGetComments(threadId);

            expect(comments[0].replies[0].deleted).toBe(true)
        });
    });

    describe('threadGetUsername function', () => {
        it('threadGetUsername should throw NotFoundError if no such user Id exist', async () => {
            const query = {
                text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
                values: ['user-12345', 'hilmatrix', '12345678', 'Hilman Mauludin'],
            };
          
            await pool.query(query);

            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);

            await expect(threadRepositoryPostgres.threadGetUsername('user')).rejects.toThrowError(NotFoundError);
        });

        it('threadGetUsername should return correct username', async () => {
            const query = {
                text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
                values: ['user-12345', 'hilmatrix', '12345678', 'Hilman Mauludin'],
            };
          
            await pool.query(query);

            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);

            const {username} = await threadRepositoryPostgres.threadGetUsername('user-12345');
            expect(username).toBe('hilmatrix')
        });
    });
    
});