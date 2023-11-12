const Threads = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadsHandler = new Threads(container);
    server.route(routes(threadsHandler));
  },
};
