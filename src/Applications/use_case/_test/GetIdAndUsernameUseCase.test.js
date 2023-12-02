const GetIdAndUsernameUseCase = require('../GetIdAndUsernameUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('GetIdAndUsernameUseCase.test', () => {
    it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
            authorization : 'authorization'
        };

        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        mockAuthenticationTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({ username: 'hilmatrix', id: 'user-12345' }));
        const getIdAndUsernameUseCase = new GetIdAndUsernameUseCase({authenticationTokenManager: mockAuthenticationTokenManager});

        const {username, id} = await getIdAndUsernameUseCase.execute(useCasePayload);

        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.authorization);
        expect(id).toStrictEqual('user-12345');
        expect(username).toStrictEqual('hilmatrix');
    })

})