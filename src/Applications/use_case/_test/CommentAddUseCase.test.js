const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentAddUseCase = require('../CommentAddUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('CommentAddUseCase', () => {

    it('should orchestrating the add comment action correctly', async () => {
        const useCasePayload = {
            userId: 'hilmatrix',
            threadId: 'thread-12345',
            content: 'konten'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve('comment-12345'));
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve(
            {username : "hilmatrix", id : "hilmatrix-123"}
        ));
  
        const addCommentUseCase = new CommentAddUseCase({threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            authenticationTokenManager : mockAuthenticationTokenManager});

        const comment = await addCommentUseCase.execute(useCasePayload);

        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.authorization);
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(
            useCasePayload.userId, useCasePayload.threadId, useCasePayload.content);

        expect(comment.id).toStrictEqual('comment-12345');
        expect(comment.content).toStrictEqual('konten');
        expect(comment.owner).toStrictEqual('hilmatrix');
    })
})
