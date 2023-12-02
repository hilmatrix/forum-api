class GetIdAndUsernameUseCase {
    constructor({authenticationTokenManager}) {
      this.authenticationTokenManager = authenticationTokenManager;
    }

    async execute(useCasePayload) {
        return await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
    }
}

module.exports = GetIdAndUsernameUseCase;
