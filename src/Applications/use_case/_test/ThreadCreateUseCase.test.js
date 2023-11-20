const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCreateUseCase = require('../ThreadCreateUseCase');

describe('ThreadCreateUseCase', () => {

    it('should orchestrating the thread create action correctly', async () => {
        const useCasePayload = {
            userId: 'hilmatrix',
            title: 'judul',
            body: 'badan',
            date: 'tanggal'
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.createThread = jest.fn().mockImplementation(() => Promise.resolve('thread-12345'));
  
        const createThreadUseCase = new ThreadCreateUseCase({threadRepository: mockThreadRepository});

        const threadId = await createThreadUseCase.execute(useCasePayload);

        expect(mockThreadRepository.createThread).toBeCalledWith(
            useCasePayload.userId, useCasePayload.title, useCasePayload.body, useCasePayload.date);

        expect(threadId).toStrictEqual('thread-12345');
    })
})
