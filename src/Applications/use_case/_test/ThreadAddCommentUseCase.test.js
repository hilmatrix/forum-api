const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadAddCommentUseCase = require('../ThreadAddCommentUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('ThreadAddCommentUseCase', () => {

    it('should orchestrating the add comment action correctly', async () => {
        const useCasePayload = {
            userId: 'hilmatrix',
            threadId: 'thread-12345',
            content: 'konten'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve('comment-12345'));
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve(
            {username : "hilmatrix", id : "hilmatrix-123"}
        ));
  
        const addCommentUseCase = new ThreadAddCommentUseCase({threadRepository: mockThreadRepository,
            authenticationTokenManager : mockAuthenticationTokenManager});

        const comment = await addCommentUseCase.execute(useCasePayload);

        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.authorization);
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.addComment).toBeCalledWith(
            useCasePayload.userId, useCasePayload.threadId, useCasePayload.content);

        expect(comment.id).toStrictEqual('comment-12345');
        expect(comment.content).toStrictEqual('konten');
        expect(comment.owner).toStrictEqual('hilmatrix');
    })
})
