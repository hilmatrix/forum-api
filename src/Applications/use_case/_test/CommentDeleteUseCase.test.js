const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentDeleteUseCase = require('../CommentDeleteUseCase');

describe('CommentDeleteUseCase', () => {
    
    it('should orchestrating the delete comment action correctly', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            threadId: 'thread-12345',
            commentId: 'comment-12345'
        };

        const mockCommentRepository = new CommentRepository();

        mockCommentRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());
  
        const deleteCommentUseCase = new CommentDeleteUseCase({commentRepository: mockCommentRepository});

        await deleteCommentUseCase.execute(useCasePayload);

        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);

    })
})

