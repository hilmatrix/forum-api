const GetIdAndUsernameUseCase = require('../../../../Applications/use_case/GetIdAndUsernameUseCase');
const ThreadCreateUseCase = require('../../../../Applications/use_case/ThreadCreateUseCase');
const ThreadGetUseCase = require('../../../../Applications/use_case/ThreadGetUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

class ThreadsHandler {
  constructor(container) {
    this.container = container;
    this.postThreadAddHandler = this.postThreadAddHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadAddHandler(request, h) {
    const authorization = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
    if (!authorization) {
      throw new AuthenticationError('Missing authentication');
    }

    const getIdAndUsernameUseCase = this.container.getInstance(GetIdAndUsernameUseCase.name);
    const {username, id : userId} = await getIdAndUsernameUseCase.execute({authorization});

    const payload = {
       username, userId,
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
}

module.exports = ThreadsHandler;
