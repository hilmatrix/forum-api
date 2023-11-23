const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDeleteCommentUseCase = require('../ThreadDeleteCommentUseCase');

describe('ThreadDeleteCommentUseCase', () => {
    
    it('should orchestrating the delete comment action correctly', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            commentId: 'comment-12345'
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());
  
        const deleteCommentUseCase = new ThreadDeleteCommentUseCase({threadRepository: mockThreadRepository});

        await deleteCommentUseCase.execute(useCasePayload);

        expect(mockThreadRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
        expect(mockThreadRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
    })
})
