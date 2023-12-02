const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyAddUseCase = require('../ReplyAddUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('ReplyAddUseCase', () => {

    it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
            userId: 'hilmatrix',
            threadId: 'thread-12345',
            commentId: 'comment-12345',
            content: 'konten'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve('reply-12345'));

        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve(
            {username : "hilmatrix", id : "hilmatrix-123"}
        ));
  
        const addReplyUseCase = new ReplyAddUseCase({threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
            authenticationTokenManager : mockAuthenticationTokenManager});

        const reply = await addReplyUseCase.execute(useCasePayload);

        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.authorization);
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith(
            useCasePayload.userId, useCasePayload.commentId, useCasePayload.content);

        expect(reply.id).toStrictEqual('reply-12345');
        expect(reply.content).toStrictEqual('konten');
        expect(reply.owner).toStrictEqual('hilmatrix');
    })
})
