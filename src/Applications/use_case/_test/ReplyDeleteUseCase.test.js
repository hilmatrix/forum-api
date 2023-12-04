
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyDeleteUseCase = require('../ReplyDeleteUseCase');

describe('ReplyDeleteUseCase', () => {
    
    it('should orchestrating the delete reply action correctly', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            username: 'hilmatrix',
            threadId: 'comment-12345',
            commentId: 'comment-12345',
            replyId: 'reply-12345'
        };

        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockCommentRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());
  
        const deleteReplyUseCase = new ReplyDeleteUseCase({commentRepository: mockCommentRepository,
            replyRepository : mockReplyRepository});

        await deleteReplyUseCase.execute(useCasePayload);

        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockReplyRepository.verifyReplyExist).toBeCalledWith(useCasePayload.commentId, useCasePayload.replyId);
        expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.userId, useCasePayload.replyId);
        expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    })
})
