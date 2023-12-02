const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentDeleteUseCase = require('../CommentDeleteUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('CommentDeleteUseCase', () => {
    
    it('should orchestrating the delete comment action correctly', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            threadId: 'comment-12345',
            commentId: 'comment-12345'
        };

        const mockCommentRepository = new CommentRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockCommentRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve(
            {username : "hilmatrix", id : "hilmatrix-123"}
        ));
  
        const deleteCommentUseCase = new CommentDeleteUseCase({commentRepository: mockCommentRepository,
            authenticationTokenManager : mockAuthenticationTokenManager});

        await deleteCommentUseCase.execute(useCasePayload);

        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.authorization);

        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
    })
})
