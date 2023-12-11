const GetIdAndUsernameUseCase = require('../../../../Applications/use_case/GetIdAndUsernameUseCase');
const LikeToggleUseCase = require('../../../../Applications/use_case/LikeToggleUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

class LikesHandler {
    constructor(container) {
      this.container = container;

      this.putLikeToggleHandler = this.putLikeToggleHandler.bind(this);
    }

    async putLikeToggleHandler(request, h) {
        const authorization = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
        if (!authorization) {
          throw new AuthenticationError('Missing authentication');
        }
        const getIdAndUsernameUseCase = this.container.getInstance(GetIdAndUsernameUseCase.name);
        const {username, id : userId} = await getIdAndUsernameUseCase.execute({authorization});
 
        const payload = {
           username, userId,
           threadId : request.params.threadId,
           commentId : request.params.commentId,
        }

        const likeToggleUseCase = this.container.getInstance(LikeToggleUseCase.name);
        await likeToggleUseCase.execute(payload);
    
        const response = h.response({
          status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = LikesHandler;
