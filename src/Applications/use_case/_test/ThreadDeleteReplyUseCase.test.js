const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDeleteReplyUseCase = require('../ThreadDeleteReplyUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('ThreadDeleteReplyUseCase', () => {
    
    it('should orchestrating the delete reply action correctly', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            threadId: 'comment-12345',
            commentId: 'comment-12345',
            replyId: 'reply-12345'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockThreadRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyReplyExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve(
            {username : "hilmatrix", id : "hilmatrix-123"}
        ));
  
        const deleteReplyUseCase = new ThreadDeleteReplyUseCase({threadRepository: mockThreadRepository,
            authenticationTokenManager : mockAuthenticationTokenManager});

        await deleteReplyUseCase.execute(useCasePayload);

        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.authorization);

        expect(mockThreadRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockThreadRepository.verifyReplyExist).toBeCalledWith(useCasePayload.commentId, useCasePayload.replyId);
        expect(mockThreadRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.userId, useCasePayload.replyId);
        expect(mockThreadRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    })
})
