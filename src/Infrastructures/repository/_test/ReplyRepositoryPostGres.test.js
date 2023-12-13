const ReplyRepositoryPostGres = require('../ReplyRepositoryPostGres');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostGres', () => {
  beforeEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: ['user-pembalas', 'pembalas', '12345678', 'Sang Pembalas'],
    };

    await pool.query(query);
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should create reply correctly', async () => {
      const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
      const { commentId } = await RepliesTableTestHelper.createThreadWithComment();

      replyRepositoryPostGres.generateId = jest.fn().mockImplementation(() => 'reply-12345');
      replyRepositoryPostGres.generateDate = jest.fn().mockImplementation(() => 'date-12345');

      const replyId = await replyRepositoryPostGres.addReply('user-pembalas', commentId, 'konten balasan');

      expect(replyId).toStrictEqual('reply-12345');

      const reply = await RepliesTableTestHelper.getReplyById(replyId);

      expect(reply).toStrictEqual({
        id: 'reply-12345',
        date: 'date-12345',
        content: 'konten balasan',
        deleted: false,
        username: 'pembalas',
      });
    });
  });

  describe('verifyReplyExist function', () => {
    it('should throw NotFoundError if commentId not found', async () => {
      const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
      const { commentId } = await RepliesTableTestHelper.createThreadWithComment();
      const replyId = await replyRepositoryPostGres.addReply('user-12345', commentId, 'konten');
      await expect(replyRepositoryPostGres.verifyReplyExist('comment-xxx', replyId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if thread, comment and reply exist', async () => {
      const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
      const { commentId } = await RepliesTableTestHelper.createThreadWithComment();
      const replyId = await replyRepositoryPostGres.addReply('user-12345', commentId, 'konten');
      await expect(replyRepositoryPostGres.verifyReplyExist(commentId, replyId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getReplies function', () => {
    it('should return replies correctly', async () => {
      const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
      const { commentId } = await RepliesTableTestHelper.createThreadWithComment();

      replyRepositoryPostGres.generateId = jest.fn().mockImplementation(() => 'reply-1');
      replyRepositoryPostGres.generateDate = jest.fn().mockImplementation(() => 'date-1');

      await replyRepositoryPostGres.addReply('user-pembalas', commentId, 'konten pertama');

      replyRepositoryPostGres.generateId = jest.fn().mockImplementation(() => 'reply-2');
      replyRepositoryPostGres.generateDate = jest.fn().mockImplementation(() => 'date-2');

      await replyRepositoryPostGres.addReply('user-pembalas', commentId, 'konten kedua');

      const replies = await replyRepositoryPostGres.getReplies(commentId);

      expect(replies).toStrictEqual([
        {
          id: 'reply-1',
          date: 'date-1',
          content: 'konten pertama',
          deleted: false,
          username: 'pembalas',
        },
        {
          id: 'reply-2',
          date: 'date-2',
          content: 'konten kedua',
          deleted: false,
          username: 'pembalas',
        },
      ]);
    });
  });

  describe('deleteReply function', () => {
    it('reply deleted should return false at first', async () => {
      const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
      const { threadId, commentId } = await RepliesTableTestHelper.createThreadWithComment();
      await replyRepositoryPostGres.addReply('user-12345', commentId, 'konten');
      const comments = await RepliesTableTestHelper.getComments(threadId);

      const replies = await replyRepositoryPostGres.getReplies(comments[0].id);
      expect(replies[0].deleted).toStrictEqual(false);
    });

    it('reply deleted should return true after deleted', async () => {
      const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
      const { threadId, commentId } = await RepliesTableTestHelper.createThreadWithComment();
      const replyId = await replyRepositoryPostGres.addReply('user-12345', commentId, 'konten');
      await replyRepositoryPostGres.deleteReply(replyId);
      const comments = await RepliesTableTestHelper.getComments(threadId);

      const replies = await replyRepositoryPostGres.getReplies(comments[0].id);
      expect(replies[0].deleted).toStrictEqual(true);
    });

    it('should return InvariantError when not checking replyId first', async () => {
      const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
      await expect(replyRepositoryPostGres.deleteReply('reply-12345')).rejects.toThrowError(InvariantError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError if userId is different', async () => {
      const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
      const { commentId } = await RepliesTableTestHelper.createThreadWithComment();
      const replyId = await replyRepositoryPostGres.addReply('user-12345', commentId, 'konten');
      await expect(replyRepositoryPostGres.verifyReplyOwner('user-54321', replyId))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError if userId is same', async () => {
      const replyRepositoryPostGres = new ReplyRepositoryPostGres(pool);
      const { commentId } = await RepliesTableTestHelper.createThreadWithComment();
      const replyId = await replyRepositoryPostGres.addReply('user-12345', commentId, 'konten');
      await expect(replyRepositoryPostGres.verifyReplyOwner('user-12345', replyId))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
});
