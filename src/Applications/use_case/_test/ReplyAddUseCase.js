const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyAddUseCase = require('../ReplyAddUseCase');

describe('ReplyAddUseCase', () => {

    it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            username: 'hilmatrix',
            threadId: 'thread-12345',
            commentId: 'comment-12345',
            content: 'konten'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve('reply-12345'));

        const addReplyUseCase = new ReplyAddUseCase({threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository});

        const reply = await addReplyUseCase.execute(useCasePayload);

        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith(
            useCasePayload.userId, useCasePayload.commentId, useCasePayload.content);

        expect(reply.id).toStrictEqual('reply-12345');
        expect(reply.content).toStrictEqual('konten');
        expect(reply.owner).toStrictEqual('hilmatrix');
    })
})
