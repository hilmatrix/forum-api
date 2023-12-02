
const CommentAddUseCase = require('../../../../Applications/use_case/CommentAddUseCase');
const CommentDeleteUseCase = require('../../../../Applications/use_case/CommentDeleteUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

class CommentsHandler {
    constructor(container) {
      this.container = container;

      this.postThreadCommentAddHandler = this.postThreadCommentAddHandler.bind(this);
      this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    }

    async postThreadCommentAddHandler(request, h) {
        const authorization = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
        if (!authorization) {
          throw new AuthenticationError('Missing authentication');
        }
    
        const payload = {
          authorization,
          userId : '',
          threadId : request.params.threadId,
          content : request.payload.content,
       }
        const threadAddCommentUseCase = this.container.getInstance(CommentAddUseCase.name);
        const {id, content, owner} = await threadAddCommentUseCase.execute(payload)
    
        const response = h.response({
          status: 'success',
          data: {
            addedComment : {
              id, content, owner
            }
          },
        });
        response.code(201);
        return response;
      }
    
      async deleteThreadCommentHandler(request, h) {
        const authorization = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
        if (!authorization) {
          throw new AuthenticationError('Missing authentication');
        }
    
        const payload = {
          authorization,
          userId : '',
          threadId : request.params.threadId,
          commentId : request.params.commentId
       }
    
        const threadDeleteCommentUseCase = this.container.getInstance(CommentDeleteUseCase.name);
        await threadDeleteCommentUseCase.execute(payload);
    
        const response = h.response({
          status: 'success',
        });
        response.code(200);
        return response;
      }
}

module.exports = CommentsHandler;
