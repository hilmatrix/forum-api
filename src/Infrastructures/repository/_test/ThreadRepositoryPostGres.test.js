const ThreadRepositoryPostGres = require('../ThreadRepositoryPostGres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {

    beforeEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
            values: ['user-12345', 'hilmatrix', '12345678', 'Hilman Mauludin'],
          };
      
        await pool.query(query);
    });

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
            expect(typeof thread.id).toBe('string')
            expect(thread.title).toBe('judul')
            expect(thread.body).toBe('badan')
            expect(typeof thread.date).toBe('string')
            expect(thread.username).toBe('hilmatrix')
        });
    });
    
});