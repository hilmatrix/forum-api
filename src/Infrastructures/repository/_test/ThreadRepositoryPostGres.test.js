const ThreadRepositoryPostGres = require('../ThreadRepositoryPostGres');
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

    describe('threadGetComments function', () => {
        it('should return thread comments and replies correctly', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostGres(pool);
            const threadId = await threadRepositoryPostgres.createThread('user-12345','judul','badan');
            await ThreadsTableTestHelper.addCommentAndReply(threadId)
            const comments = await threadRepositoryPostgres.threadGetComments(threadId);

            expect(typeof comments).toBe('object')
            expect(typeof comments[0].replies).toBe('object')
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