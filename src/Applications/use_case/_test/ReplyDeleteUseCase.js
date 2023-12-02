const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
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

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyReplyExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());
  
        const deleteReplyUseCase = new ReplyDeleteUseCase({threadRepository: mockThreadRepository});

        await deleteReplyUseCase.execute(useCasePayload);

        expect(mockThreadRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockThreadRepository.verifyReplyExist).toBeCalledWith(useCasePayload.commentId, useCasePayload.replyId);
        expect(mockThreadRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.userId, useCasePayload.replyId);
        expect(mockThreadRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    })
})
