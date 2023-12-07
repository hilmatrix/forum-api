const CommentRepositoryPostGres = require('../CommentRepositoryPostGres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostGres', () => {
    beforeEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
            values: ['user-komentator', 'komentator', '12345678', 'Sang komentator'],
          };
      
        await pool.query(query);
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
      });
    
      afterAll(async () => {
        await pool.end();
      });

      describe('addComment and getComments function', () => {
        it('should create comment correctly', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread();

            commentRepositoryPostGres.generateId = jest.fn().mockImplementation(() => `comment-12345`);
            commentRepositoryPostGres.generateDate = jest.fn().mockImplementation(() => `date-12345`);

            const commentId = await commentRepositoryPostGres.addComment('user-komentator',threadId,'konten komentar');

            expect(commentId).toStrictEqual(`comment-12345`) 

            const comment = await CommentsTableTestHelper.getCommentById(commentId);

            expect(comment).toStrictEqual({
                id: "comment-12345", 
                date: "date-12345", 
                content: "konten komentar", 
                deleted: false, 
                username: "komentator"
            })  
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

        
    describe('getComments function', () => {
        it('should return comments correctly', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread();

            commentRepositoryPostGres.generateId = jest.fn().mockImplementation(() => `comment-1`);
            commentRepositoryPostGres.generateDate = jest.fn().mockImplementation(() => `date-1`);

            await commentRepositoryPostGres.addComment('user-komentator',threadId,'konten pertama');

            commentRepositoryPostGres.generateId = jest.fn().mockImplementation(() => `comment-2`);
            commentRepositoryPostGres.generateDate = jest.fn().mockImplementation(() => `date-2`);

            await commentRepositoryPostGres.addComment('user-komentator',threadId,'konten kedua');

            const comments = await commentRepositoryPostGres.getComments(threadId);

            expect(comments).toStrictEqual([
                {
                    id: "comment-1", 
                    date: "date-1", 
                    content: "konten pertama", 
                    deleted: false, 
                    username: "komentator"
                },
                {
                    id: "comment-2", 
                    date: "date-2", 
                    content: "konten kedua", 
                    deleted: false, 
                    username: "komentator"
                }
            ])
        });
    });
    

    describe('deleteComment function', () => {
        it('comment deleted should return false at first', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread();
            await commentRepositoryPostGres.addComment('user-12345',threadId,'konten 1');
            const comments = await commentRepositoryPostGres.getComments(threadId);

            expect(comments[0].deleted).toStrictEqual(false)
        });

        it('comment deleted should return true after deleted', async () => {
            const commentRepositoryPostGres = new CommentRepositoryPostGres(pool);
            const threadId = await CommentsTableTestHelper.createThread();
            const commentId = await commentRepositoryPostGres.addComment('user-12345',threadId,'konten 1');
            await commentRepositoryPostGres.deleteComment(commentId);
            const comments = await commentRepositoryPostGres.getComments(threadId);

            expect(comments[0].deleted).toStrictEqual(true)
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