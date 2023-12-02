const Comments = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentsHandler = new Comments(container);
    server.route(routes(commentsHandler));
  },
};
