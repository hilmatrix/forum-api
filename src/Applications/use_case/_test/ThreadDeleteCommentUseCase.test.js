const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDeleteCommentUseCase = require('../ThreadDeleteCommentUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('ThreadDeleteCommentUseCase', () => {
    
    it('should orchestrating the delete comment action correctly', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            threadId: 'comment-12345',
            commentId: 'comment-12345'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockThreadRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve(
            {username : "hilmatrix", id : "hilmatrix-123"}
        ));
  
        const deleteCommentUseCase = new ThreadDeleteCommentUseCase({threadRepository: mockThreadRepository,
            authenticationTokenManager : mockAuthenticationTokenManager});

        await deleteCommentUseCase.execute(useCasePayload);

        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.authorization);

        expect(mockThreadRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockThreadRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
        expect(mockThreadRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
    })
})
