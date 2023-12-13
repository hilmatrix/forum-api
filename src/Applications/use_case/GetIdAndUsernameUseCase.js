class GetIdAndUsernameUseCase {
  constructor({ authenticationTokenManager }) {
    this.authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    // eslint-disable-next-line
    return await this.authenticationTokenManager.decodePayload(useCasePayload.authorization);
  }
}

module.exports = GetIdAndUsernameUseCase;
