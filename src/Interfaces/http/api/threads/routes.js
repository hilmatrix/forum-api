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
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}',
      handler: handler.deleteThreadCommentHandler,
    },
    {
      method: 'POST',
      path: '/threads/{threadId}/comments/{commentId}/replies',
      handler: handler.postThreadReplyAddHandler,
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
      handler: handler.deleteThreadReplyHandler,
    },
  ]);
  
  module.exports = routes;
  