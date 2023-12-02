const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCreateUseCase = require('../ThreadCreateUseCase');

describe('ThreadCreateUseCase', () => {

    it('should orchestrating the thread create action correctly', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            username: 'hilmatrix',
            title: 'judul',
            body: 'badan'
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.createThread = jest.fn().mockImplementation(() => Promise.resolve('thread-12345'));

        const createThreadUseCase = new ThreadCreateUseCase(
            {threadRepository: mockThreadRepository});
        const thread = await createThreadUseCase.execute(useCasePayload);


        expect(mockThreadRepository.createThread).toBeCalledWith(
            useCasePayload.userId, useCasePayload.title, useCasePayload.body);

        expect(thread.id).toStrictEqual('thread-12345');
        expect(thread.owner).toStrictEqual('hilmatrix');
        expect(thread.title).toStrictEqual('judul');
    })
})
