const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCreateUseCase = require('../ThreadCreateUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('ThreadCreateUseCase', () => {

    it('should orchestrating the thread create action correctly', async () => {
        const useCasePayload = {
            authorization: 'authorization',
            userId: 'hilmatrix',
            title: 'judul',
            body: 'badan'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockThreadRepository.createThread = jest.fn().mockImplementation(() => Promise.resolve('thread-12345'));
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve(
            {username : "hilmatrix", id : "hilmatrix-123"}
        ));

        const createThreadUseCase = new ThreadCreateUseCase(
            {threadRepository: mockThreadRepository, authenticationTokenManager : mockAuthenticationTokenManager});
        const thread = await createThreadUseCase.execute(useCasePayload);


        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.authorization);
        expect(mockThreadRepository.createThread).toBeCalledWith(
            useCasePayload.userId, useCasePayload.title, useCasePayload.body);

        expect(thread.id).toStrictEqual('thread-12345');
        expect(thread.owner).toStrictEqual('hilmatrix');
        expect(thread.title).toStrictEqual('judul');
    })
})
