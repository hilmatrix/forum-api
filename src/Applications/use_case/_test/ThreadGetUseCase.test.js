const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadGetUseCase = require('../ThreadGetUseCase');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('ThreadGetUseCase', () => {
    
    it('should orchestrating the thread get action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-12345'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockCommentRepository.getComments = jest.fn().mockImplementation(() => Promise.resolve(
            [{id : 'comment-1', deleted : false, content : 'haha'}]
        ));

        mockReplyRepository.getReplies = jest.fn().mockImplementation(() => Promise.resolve(
            [{id : 'reply-1', deleted : false, content : 'hihi'}]
        ));

        mockThreadRepository.threadGet = jest.fn().mockImplementation(() => Promise.resolve(
            {id : 'thread-12345', title : 'judul', user_id : 'user-12345',
                body : 'body', date : 'date-12345', username : 'hilmatrix'}));

  
        const getThreadUseCase = new ThreadGetUseCase({threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,replyRepository: mockReplyRepository});

        let thread = await getThreadUseCase.execute(useCasePayload);

        expect(mockThreadRepository.threadGet).toBeCalledWith(useCasePayload.threadId);

        expect(mockCommentRepository.getComments).toBeCalledWith('thread-12345');
        expect(mockCommentRepository.getComments).toBeCalledWith('thread-12345');

        expect(thread.id).toStrictEqual('thread-12345');
        expect(thread.title).toStrictEqual('judul');
        expect(thread.username).toStrictEqual('hilmatrix');
        expect(thread.body).toStrictEqual('body');
        expect(thread.date).toStrictEqual('date-12345');
        expect(thread.comments[0].content).toStrictEqual('haha');
        expect(thread.comments[0].replies[0].content).toStrictEqual('hihi');

        mockCommentRepository.getComments = jest.fn().mockImplementation(() => Promise.resolve(
            [{id : 'comment-1', deleted : true, content : 'haha'}]
        ));

        mockReplyRepository.getReplies = jest.fn().mockImplementation(() => Promise.resolve(
            [{id : 'reply-1', deleted : true, content : 'hihi'}]
        ));

        thread = await getThreadUseCase.execute(useCasePayload);

        expect(thread.comments[0].content).toStrictEqual('**komentar telah dihapus**');
        expect(thread.comments[0].replies[0].content).toStrictEqual('**balasan telah dihapus**');

        mockReplyRepository.getReplies = jest.fn().mockImplementation(() => Promise.resolve(undefined));

        await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(InvariantError);

        mockCommentRepository.getComments = jest.fn().mockImplementation(() => Promise.resolve(undefined));

        await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(InvariantError);
    })
})

