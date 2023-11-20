const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadGetUseCase = require('../ThreadGetUseCase');

describe('ThreadGetUseCase', () => {
    
    it('should orchestrating the thread get action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-12345'
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.getThread = jest.fn().mockImplementation(() => Promise.resolve('thread-12345'));
  
        const getThreadUseCase = new ThreadGetUseCase({threadRepository: mockThreadRepository});

        await getThreadUseCase.execute(useCasePayload);

        expect(mockThreadRepository.getThread).toBeCalledWith(useCasePayload.threadId);
    })
})

