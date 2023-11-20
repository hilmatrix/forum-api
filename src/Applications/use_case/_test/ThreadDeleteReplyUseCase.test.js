const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDeleteReplyUseCase = require('../ThreadDeleteReplyUseCase');

describe('ThreadDeleteReplyUseCase', () => {
    
    it('should orchestrating the thread get action correctly', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            replyId: 'reply-12345'
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());
  
        const deleteReplyUseCase = new ThreadDeleteReplyUseCase({threadRepository: mockThreadRepository});

        await deleteReplyUseCase.execute(useCasePayload);

        expect(mockThreadRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.userId, useCasePayload.replyId);
        expect(mockThreadRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    })
})
