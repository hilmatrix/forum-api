const Replies = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const repliesHandler = new Replies(container);
    server.route(routes(repliesHandler));
  },
};
