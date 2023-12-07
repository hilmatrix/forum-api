const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
    let authorization;
    let threadId;

    beforeAll (async () => {
              // Arrange
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

      authorization = `bearer ${responseJson.data.accessToken}`
    });

    afterAll(async () => {
      ThreadsTableTestHelper.cleanTable();
      await pool.end();
    });
  
    afterEach(async () => {
      
    });

    describe('when POST /threads', () => {

        it('should response 401 when request does not have authentication', async () => {
            const server = await createServer(container);
    
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
              });
        
              const responseJson = JSON.parse(response.payload);
              expect(response.statusCode).toStrictEqual(401);
              expect(responseJson.status).toStrictEqual('fail');
        });

        it('should response 201 when successful', async () => {

            const requestPayload = {
                title: 'judul',
                body: 'badan'
            };

            const requestHeaders = {
                authorization
            }
    
            const server = await createServer(container);
    
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers : requestHeaders
              });
        
              const responseJson = JSON.parse(response.payload);
              expect(response.statusCode).toStrictEqual(201);
              expect(responseJson.status).toStrictEqual('success');

              threadId = responseJson.data.addedThread.id
        });

    });

    describe('when GET /threads', () => {
        it('should response 200 when successful', async () => {
            const server = await createServer(container);

            const requestPayload = {
                title: 'judul',
                body: 'badan'
            };

            const requestHeaders = {
                authorization
            }
    
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`
              });
        
              const responseJson = JSON.parse(response.payload);
              expect(response.statusCode).toStrictEqual(200);
              expect(responseJson.status).toStrictEqual('success');
        });
    });
});