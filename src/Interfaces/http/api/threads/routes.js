const routes = (handler) => ([
    {
      method: 'POST',
      path: '/threads',
      handler: handler.postThreadAddHandler,
    },
    {
      method: 'GET',
      path: '/threads/{threadId}',
      handler: handler.getThreadHandler,
    },
    {
      method: 'POST',
      path: '/threads/{threadId}/comments',
      handler: handler.postThreadCommentAddHandler,
    },
  ]);
  
  module.exports = routes;
  