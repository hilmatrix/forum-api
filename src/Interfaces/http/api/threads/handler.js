const ThreadCreateUseCase = require('../../../../Applications/use_case/ThreadCreateUseCase');
const ThreadAddCommentUseCase = require('../../../../Applications/use_case/ThreadAddCommentUseCase');
const ThreadGetUseCase = require('../../../../Applications/use_case/ThreadGetUseCase');
const ThreadDeleteCommentUseCase = require('../../../../Applications/use_case/ThreadDeleteCommentUseCase');
const ThreadAddReplyUseCase = require('../../../../Applications/use_case/ThreadAddReplyUseCase');
const ThreadDeleteReplyUseCase = require('../../../../Applications/use_case/ThreadDeleteReplyUseCase');


const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

class ThreadsHandler {
  constructor(container) {
    this.container = container;
    this.postThreadAddHandler = this.postThreadAddHandler.bind(this);
    this.postThreadCommentAddHandler = this.postThreadCommentAddHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    this.postThreadReplyAddHandler = this.postThreadReplyAddHandler.bind(this);
    this.deleteThreadReplyHandler = this.deleteThreadReplyHandler.bind(this);
  }

  async postThreadAddHandler(request, h) {
    const authorization = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
    if (!authorization) {
      throw new AuthenticationError('Missing authentication');
    }

    const payload = {
       authorization,
       userId : '',
       title : request.payload.title,
       body : request.payload.body,
    }

    const threadCreateUseCase = this.container.getInstance(ThreadCreateUseCase.name);
    const {id, title, owner} = await threadCreateUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread : {
          id, title, owner
        }
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const payload = {
      threadId : request.params.threadId
   }

    const threadGetUseCase = this.container.getInstance(ThreadGetUseCase.name);
    const {id, title, body, date, data, username, comments} = await threadGetUseCase.execute(payload)

    const response = h.response({
      status: 'success',
      data: {
        thread : {
          id, title, body, date, data, username, comments
        }
      },
    });
    response.code(200);
    return response;
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
    const threadAddCommentUseCase = this.container.getInstance(ThreadAddCommentUseCase.name);
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

    const threadDeleteCommentUseCase = this.container.getInstance(ThreadDeleteCommentUseCase.name);
    await threadDeleteCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
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

   const threadAddReplyUseCase = this.container.getInstance(ThreadAddReplyUseCase.name);
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

    const threadDeleteReplyUseCase = this.container.getInstance(ThreadDeleteReplyUseCase.name);
    await threadDeleteReplyUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
