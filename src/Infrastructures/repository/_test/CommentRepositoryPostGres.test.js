const CommentRepositoryPostGres = require('../CommentRepositoryPostGres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostGres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
      });
    
      afterAll(async () => {
        await pool.end();
      });

      describe('addComment function', () => {
        it('should return type of string', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread();
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            expect(typeof commentId).toBe('string')
        });
    });

    describe('verifyCommentExist function', () => {
        it('should throw NotFoundError if threadId not found', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread();
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            await expect(commentRepositoryPostGres.verifyCommentExist('thread-xxx', commentId)).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError if thread and comment exist', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread();
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            await expect(commentRepositoryPostGres.verifyCommentExist(threadId, commentId)).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('deleteComment function', () => {
        it('comment deleted should return false at first', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread();
            await commentRepositoryPostGres.addComment('user-12345',threadId,'konten 1');
            const comments = await CommentsTableTestHelper.getComments(threadId);

            expect(comments[0].deleted).toBe(false)
        });

        it('comment deleted should return true after deleted', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread();
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten 1');
            await commentRepositoryPostGres.deleteComment(commentId);
            const comments = await CommentsTableTestHelper.getComments(threadId);

            expect(comments[0].deleted).toBe(true)
        });

        it('should return InvariantError when not checking commentId first', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            await expect(commentRepositoryPostGres.deleteComment('comment-12345')).rejects.toThrowError(InvariantError);
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should throw AuthorizationError if userId is different', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread()
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            await expect(commentRepositoryPostGres.verifyCommentOwner('user-54321',commentId))
                .rejects.toThrowError(AuthorizationError);
        });

        it('should not throw AuthorizationError if userId is same', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
           const threadId = await CommentsTableTestHelper.createThread()
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten');
            await expect(commentRepositoryPostGres.verifyCommentOwner('user-12345',commentId))
                .resolves.not.toThrowError(AuthorizationError);
        });
    });   
});