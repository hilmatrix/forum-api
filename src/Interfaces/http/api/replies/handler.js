const ReplyAddUseCase = require('../../../../Applications/use_case/ReplyAddUseCase');
const ReplyDeleteUseCase = require('../../../../Applications/use_case/ReplyDeleteUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

class RepliesHandler {
    constructor(container) {
      this.container = container;
      this.postThreadReplyAddHandler = this.postThreadReplyAddHandler.bind(this);
      this.deleteThreadReplyHandler = this.deleteThreadReplyHandler.bind(this);
    }

    async postThreadReplyAddHandler(request, h) {
        const authorization = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
        if (!authorization) {
          throw new AuthenticationError('Missing authentication');
        }
    
        const payload = {
          authorization,
          userId : '',
          threadId : request.params.threadId,
          commentId : request.params.commentId,
          content : request.payload.content
       }
    
       const threadAddReplyUseCase = this.container.getInstance(ReplyAddUseCase.name);
       const {id, content, owner} = await threadAddReplyUseCase.execute(payload)
    
         const response = h.response({
          status: 'success',
          data: {
            addedReply : {
              id, content, owner
            }
          },
        });
        response.code(201);
        return response;
      }
    
      async deleteThreadReplyHandler(request, h) {
        const authorization = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
        if (!authorization) {
          throw new AuthenticationError('Missing authentication');
        }
    
        const payload = {
          authorization,
          userId : '',
          threadId : request.params.threadId,
          commentId : request.params.commentId,
          replyId : request.params.replyId
       }
    
        const threadDeleteReplyUseCase = this.container.getInstance(ReplyDeleteUseCase.name);
        await threadDeleteReplyUseCase.execute(payload);
    
        const response = h.response({
          status: 'success',
        });
        response.code(200);
        return response;
      }
}

module.exports = RepliesHandler;