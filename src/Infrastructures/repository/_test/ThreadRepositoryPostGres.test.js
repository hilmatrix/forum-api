const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
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
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            expect(typeof threadId).toBe('string')
        });
    });

    describe('verifyThreadExist function', () => {
        it('should throw NotFoundError if not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            await expect(threadRepositoryPostgres.verifyThreadExist('thread-xxx')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError if thread exist', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            await expect(threadRepositoryPostgres.verifyThreadExist(threadId)).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('threadGet function', () => {
        it('should not throw NotFoundError if thread is not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            await expect(threadRepositoryPostgres.threadGet('thread-xxx')).rejects.toThrowError(NotFoundError);
        });

        it('should return thread correctly', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const thread = await threadRepositoryPostgres.threadGet(threadId);

            expect(typeof thread).toBe('object')
        });
    });

    describe('addComment function', () => {
        it('should return type of string', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await threadRepositoryPostgres.addComment('user-12345',threadId,'konten');
            expect(typeof commentId).toBe('string')
        });
    });

    describe('verifyCommentExist function', () => {
        it('should throw NotFoundError if threadId not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await threadRepositoryPostgres.addComment('user-12345',threadId,'konten');
            await expect(threadRepositoryPostgres.verifyCommentExist('thread-xxx', commentId)).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError if thread and comment exist', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await threadRepositoryPostgres.addComment('user-12345',threadId,'konten');
            await expect(threadRepositoryPostgres.verifyCommentExist(threadId, commentId)).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('addReply function', () => {
        it('should return type of string', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await threadRepositoryPostgres.addComment('user-12345',threadId,'konten');
            const replyId = await threadRepositoryPostgres.addReply('user-12345',commentId,'konten');
            expect(typeof replyId).toBe('string')
        });
    });

    describe('verifyReplyExist function', () => {
        it('should throw NotFoundError if commentId not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await threadRepositoryPostgres.addComment('user-12345',threadId,'konten');
            const replyId = await threadRepositoryPostgres.addReply('user-12345',commentId,'konten');
            await expect(threadRepositoryPostgres.verifyCommentExist('comment-xxx', replyId)).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError if thread, comment and reply exist', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await threadRepositoryPostgres.addComment('user-12345',threadId,'konten');
            const replyId = await threadRepositoryPostgres.addReply('user-12345',commentId,'konten');
            await expect(threadRepositoryPostgres.verifyCommentExist(commentId, replyId)).rejects.toThrowError(NotFoundError);
        });
    });

    describe('threadGetComments function', () => {
        it('should return thread comments and replies correctly', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            const commentId = await threadRepositoryPostgres.addComment('user-12345',threadId,'konten 1');
            await threadRepositoryPostgres.addReply('user-12345',commentId,'konten 2');
            const comments = await threadRepositoryPostgres.threadGetComments(threadId);

            expect(typeof comments).toBe('object')
            expect(typeof comments[0].replies).toBe('object')
        });
    });
});