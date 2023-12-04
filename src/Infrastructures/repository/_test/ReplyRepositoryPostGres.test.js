
const ReplyRepositoryPostGres = require('../ReplyRepositoryPostGres');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostGres', () => {
    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
      });
    
      afterAll(async () => {
        await pool.end();
      });

      describe('addReply function', () => {
        it('should return type of string', async () => {
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const {commentId} = await RepliesTableTestHelper.createThreadWithComment()
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            expect(typeof replyId).toBe('string')
        });
    });

    describe('verifyReplyExist function', () => {
        it('should throw NotFoundError if commentId not found', async () => {
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const {commentId} = await RepliesTableTestHelper.createThreadWithComment()
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            await expect(replyRepositoryPostGres.verifyReplyExist('comment-xxx', replyId)).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError if thread, comment and reply exist', async () => {
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const {commentId} = await RepliesTableTestHelper.createThreadWithComment()
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            await expect(replyRepositoryPostGres.verifyReplyExist(commentId, replyId)).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('deleteReply function', () => {
        it('reply deleted should return false at first', async () => {
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const {threadId, commentId} = await RepliesTableTestHelper.createThreadWithComment()
            await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            const comments = await RepliesTableTestHelper.getComments(threadId);

            expect(comments[0].replies[0].deleted).toBe(false)
        });

        it('reply deleted should return true after deleted', async () => {
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const {threadId, commentId} = await RepliesTableTestHelper.createThreadWithComment()
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            await replyRepositoryPostGres.deleteReply(replyId);
            const comments = await RepliesTableTestHelper.getComments(threadId);

            expect(comments[0].replies[0].deleted).toBe(true)
        });

        it('should return InvariantError when not checking replyId first', async () => {
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            await expect(replyRepositoryPostGres.deleteReply('reply-12345')).rejects.toThrowError(InvariantError);
        });
        
    });

    describe('verifyReplyOwner function', () => {
        it('should throw AuthorizationError if userId is different', async () => {
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const {commentId} = await RepliesTableTestHelper.createThreadWithComment()
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            await expect(replyRepositoryPostGres.verifyReplyOwner('user-54321',replyId))
                .rejects.toThrowError(AuthorizationError);
        });

        it('should not throw AuthorizationError if userId is same', async () => {
            const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
            const {commentId} = await RepliesTableTestHelper.createThreadWithComment()
            const replyId = await replyRepositoryPostGres.addReply('user-12345',commentId,'konten');
            await expect(replyRepositoryPostGres.verifyReplyOwner('user-12345',replyId))
                .resolves.not.toThrowError(AuthorizationError);
        });
    });   
});
    