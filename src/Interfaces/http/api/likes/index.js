const Likes = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  register: async (server, { container }) => {
    const likesHandler = new Likes(container);
    server.route(routes(likesHandler));
  },
};
