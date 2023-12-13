const LikeRepositoryPostGres = require('../LikeRepositoryPostGres');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostGres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike and getLike', () => {
    it('addLike should create and getLike should return data correctly', async () => {
      const likeRepositoryPostGres = new LikeRepositoryPostGres(pool);
      const { commentId } = await LikesTableTestHelper.createThreadWithComment('thread-12345', 'comment-12345');

      likeRepositoryPostGres.generateId = jest.fn().mockImplementation(() => 'like-12345');

      await likeRepositoryPostGres.addLike('user-12345', commentId);
      let userLike = await likeRepositoryPostGres.getLike('user-12345', 'comment-???');

      expect(!userLike).toStrictEqual(true);

      userLike = await likeRepositoryPostGres.getLike('user-12345', commentId);

      expect(userLike).toStrictEqual({
        id: 'like-12345',
        user_id: 'user-12345',
        comment_id: 'comment-12345',
      });
    });
  });

  describe('removeLike', () => {
    it('getLike should return empty after called removeLike called', async () => {
      const likeRepositoryPostGres = new LikeRepositoryPostGres(pool);
      const { commentId } = await LikesTableTestHelper.createThreadWithComment('thread-12345', 'comment-12345');

      await likeRepositoryPostGres.addLike('user-12345', commentId);

      let userLike = await likeRepositoryPostGres.getLike('user-12345', commentId);

      expect(!userLike).toStrictEqual(false);

      await likeRepositoryPostGres.removeLike('user-12345', commentId);

      userLike = await likeRepositoryPostGres.getLike('user-12345', commentId);

      expect(!userLike).toStrictEqual(true);
    });
  });

  describe('getAllLikes', () => {
    it('should return all likes', async () => {
      const likeRepositoryPostGres = new LikeRepositoryPostGres(pool);
      const { commentId } = await LikesTableTestHelper.createThreadWithComment('thread-12345', 'comment-12345');

      let userLikes = await likeRepositoryPostGres.getAllLikes(commentId);

      expect(userLikes.length).toStrictEqual(0);

      likeRepositoryPostGres.generateId = jest.fn().mockImplementation(() => 'like-1');
      await likeRepositoryPostGres.addLike('user-1', commentId);

      userLikes = await likeRepositoryPostGres.getAllLikes(commentId);

      expect(userLikes).toStrictEqual([{
        id: 'like-1',
        user_id: 'user-1',
        comment_id: 'comment-12345',
      }]);

      likeRepositoryPostGres.generateId = jest.fn().mockImplementation(() => 'like-2');
      await likeRepositoryPostGres.addLike('user-2', commentId);

      userLikes = await likeRepositoryPostGres.getAllLikes(commentId);

      expect(userLikes).toEqual([{
        id: 'like-1',
        user_id: 'user-1',
        comment_id: 'comment-12345',
      },
      {
        id: 'like-2',
        user_id: 'user-2',
        comment_id: 'comment-12345',
      },
      ]);
    });
  });
});
