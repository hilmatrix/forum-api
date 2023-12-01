const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadAddReplyUseCase = require('../ThreadAddReplyUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('ThreadAddReplyUseCase', () => {

    it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
            userId: 'hilmatrix',
            threadId: 'thread-12345',
            commentId: 'comment-12345',
            content: 'konten'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve('reply-12345'));

        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve(
            {username : "hilmatrix", id : "hilmatrix-123"}
        ));
  
        const addReplyUseCase = new ThreadAddReplyUseCase({threadRepository: mockThreadRepository,
            authenticationTokenManager : mockAuthenticationTokenManager});

        const reply = await addReplyUseCase.execute(useCasePayload);

        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.authorization);
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockThreadRepository.addReply).toBeCalledWith(
            useCasePayload.userId, useCasePayload.commentId, useCasePayload.content);

        expect(reply.id).toStrictEqual('reply-12345');
        expect(reply.content).toStrictEqual('konten');
        expect(reply.owner).toStrictEqual('hilmatrix');
    })
})
