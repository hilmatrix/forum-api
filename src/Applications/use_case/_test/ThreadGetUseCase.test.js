const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadGetUseCase = require('../ThreadGetUseCase');

describe('ThreadGetUseCase', () => {
    
    it('should orchestrating the thread get action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-12345'
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.threadGet = jest.fn().mockImplementation(() => Promise.resolve(
            {id : 'thread-12345', title : 'judul', user_id : 'user-12345', body : 'body', date : 'date-12345'}));
        mockThreadRepository.threadGetUsername = jest.fn().mockImplementation(() => Promise.resolve({username : 'hilmatrix'}));
        mockThreadRepository.threadGetComments = jest.fn().mockImplementation(() => Promise.resolve(
            [{deleted : false, content : 'haha', replies : [{deleted : false, content : 'hihi'}]}] ));
  
        const getThreadUseCase = new ThreadGetUseCase({threadRepository: mockThreadRepository});

        let thread = await getThreadUseCase.execute(useCasePayload);

        expect(mockThreadRepository.threadGet).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.threadGetUsername).toBeCalledWith('user-12345');
        expect(mockThreadRepository.threadGetComments).toBeCalledWith('thread-12345');

        expect(thread.id).toStrictEqual('thread-12345');
        expect(thread.title).toStrictEqual('judul');
        expect(thread.username).toStrictEqual('hilmatrix');
        expect(thread.body).toStrictEqual('body');
        expect(thread.date).toStrictEqual('date-12345');
        expect(thread.comments[0].content).toStrictEqual('haha');
        expect(thread.comments[0].replies[0].content).toStrictEqual('hihi');

        mockThreadRepository.threadGetComments = jest.fn().mockImplementation(() => Promise.resolve(
            [{deleted : true, content : 'haha', replies : [{deleted : true, content : 'hihi'}]}] ));

        thread = await getThreadUseCase.execute(useCasePayload);

        expect(thread.comments[0].content).toStrictEqual('**komentar telah dihapus**');
        expect(thread.comments[0].replies[0].content).toStrictEqual('**balasan telah dihapus**');
    })
})

