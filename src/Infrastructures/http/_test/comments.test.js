const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  let authorization;
  let threadId;
  let commentId;

  beforeAll(async () => {
    const requestPayload = {
      username: 'hilmatrix',
      password: '12345678',
    };
    const server = await createServer(container);
    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'hilmatrix',
        password: '12345678',
        fullname: 'Hilman Mauludin',
      },
    });

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);

    authorization = `bearer ${responseJson.data.accessToken}`;

    /// ////////////////////////////////////

    const threadPayload = {
      title: 'judul',
      body: 'badan',
    };

    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: threadPayload,
      headers: { authorization },
    });

    const threadResponseJson = JSON.parse(threadResponse.payload);
    expect(threadResponse.statusCode).toStrictEqual(201);
    expect(threadResponseJson.status).toStrictEqual('success');

    threadId = threadResponseJson.data.addedThread.id;
  });

  afterAll(async () => {
    CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {

  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when request does not have authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(401);
      expect(responseJson.status).toStrictEqual('fail');
    });

    it('should response 201 when successful', async () => {
      const requestPayload = {
        content: 'judul',
      };

      const requestHeaders = {
        authorization,
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: requestHeaders,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toStrictEqual(201);
      expect(responseJson.status).toStrictEqual('success');

      commentId = responseJson.data.addedComment.id;
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when request does not have authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(401);
      expect(responseJson.status).toStrictEqual('fail');
    });

    it('should response 200 when successful', async () => {
      const requestHeaders = {
        authorization,
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: requestHeaders,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toStrictEqual(200);
      expect(responseJson.status).toStrictEqual('success');
    });
  });
});
