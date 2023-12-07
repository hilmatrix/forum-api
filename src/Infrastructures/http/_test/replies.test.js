const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
    let authorization;
    let threadId;
    let commentId;
    let replyId;

    beforeAll (async () => {
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

          ///////////////////////////////////////

          const threadPayload = {
            title: 'judul',
            body: 'badan'
          };

            const threadResponse = await server.inject({
              method: 'POST',
              url: '/threads',
              payload: threadPayload,
              headers : {authorization}
            });
          
            const threadResponseJson = JSON.parse(threadResponse.payload);
            threadId = threadResponseJson.data.addedThread.id

          ////////////////////////////////////////////////

            const commentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {content: 'judul'},
                headers : {authorization}
            });

            const commentResponseJson = JSON.parse(commentResponse.payload);

            commentId = commentResponseJson.data.addedComment.id
    });

    afterAll(async () => {
        RepliesTableTestHelper.cleanTable();
        await pool.end();
    });
  
    afterEach(async () => {
      
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 401 when request does not have authentication', async () => {
            const server = await createServer(container);
    
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`
              });
        
              const responseJson = JSON.parse(response.payload);
              expect(response.statusCode).toStrictEqual(401);
              expect(responseJson.status).toStrictEqual('fail');
        });

        it('should response 201 when successful', async () => {

            const requestPayload = {
                content: 'konten'
            };

            const requestHeaders = {
                authorization
            }
    
            const server = await createServer(container);
    
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers : requestHeaders
              });
        
              const responseJson = JSON.parse(response.payload);

              expect(response.statusCode).toStrictEqual(201);
              expect(responseJson.status).toStrictEqual('success');

              replyId = responseJson.data.addedReply.id
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 401 when request does not have authentication', async () => {
            const server = await createServer(container);
    
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
              });
        
              const responseJson = JSON.parse(response.payload);
              expect(response.statusCode).toStrictEqual(401);
              expect(responseJson.status).toStrictEqual('fail');
        });

        it('should response 200 when successful', async () => {
            const requestHeaders = {
                authorization
            }
    
            const server = await createServer(container);
    
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers : requestHeaders
              });
        
              const responseJson = JSON.parse(response.payload);

              expect(response.statusCode).toStrictEqual(200);
              expect(responseJson.status).toStrictEqual('success');
              
        });
    });
});
