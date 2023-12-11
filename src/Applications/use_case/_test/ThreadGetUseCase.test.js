const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

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
        const mockLikeRepository = new LikeRepository();

        mockCommentRepository.getComments = jest.fn().mockImplementation(() => Promise.resolve(
            [{id : 'comment-12345', deleted : false, content : 'haha', date :'date-1', username : 'hilman'}]
        ));

        mockReplyRepository.getReplies = jest.fn().mockImplementation(() => Promise.resolve(
            [{id : 'reply-12345', deleted : false, content : 'hihi', date :'date-2', username : 'mauludin'}]
        ));

        mockLikeRepository.getAllLikes = jest.fn().mockImplementation(() => Promise.resolve(
            [{id : 'like-1', user_id : 'user-1', comment_id : 'comment-1'}]
        ));


        mockThreadRepository.threadGet = jest.fn().mockImplementation(() => Promise.resolve(
            {id : 'thread-12345', title : 'judul', user_id : 'user-12345',
                body : 'body', date : 'date-12345', username : 'hilmatrix'}));

  
        const getThreadUseCase = new ThreadGetUseCase({threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,replyRepository: mockReplyRepository,
            likeRepository: mockLikeRepository});

        let thread = await getThreadUseCase.execute(useCasePayload);

        expect(mockThreadRepository.threadGet).toBeCalledWith(useCasePayload.threadId);

        expect(mockCommentRepository.getComments).toBeCalledWith('thread-12345');
        expect(mockReplyRepository.getReplies).toBeCalledWith('comment-12345');
        expect(mockLikeRepository.getAllLikes).toBeCalledWith('comment-12345');

        expect(thread).toStrictEqual({
            id : 'thread-12345',
            title : 'judul',
            username : 'hilmatrix',
            body : 'body',
            date : 'date-12345',
            comments : [{
                id : 'comment-12345',
                deleted : false,
                content : 'haha',
                date : 'date-1',
                username : 'hilman',
                likeCount : 1,
                replies : [{
                    id : 'reply-12345',
                    deleted : false,
                    content : 'hihi',
                    date : 'date-2',
                    username : 'mauludin',
                }]
            }]
        });

        mockCommentRepository.getComments = jest.fn().mockImplementation(() => Promise.resolve(
            [{id : 'comment-12345', deleted : true, content : 'haha'}]
        ));

        mockReplyRepository.getReplies = jest.fn().mockImplementation(() => Promise.resolve(
            [{id : 'reply-12345', deleted : true, content : 'hihi'}]
        ));

        thread = await getThreadUseCase.execute(useCasePayload);

        expect(thread).toStrictEqual({
            id : 'thread-12345',
            title : 'judul',
            username : 'hilmatrix',
            body : 'body',
            date : 'date-12345',
            comments : [{
                id : 'comment-12345',
                deleted : true,
                content : '**komentar telah dihapus**',
                likeCount : 1,
                replies : [{
                    id : 'reply-12345',
                    deleted : true,
                    content : '**balasan telah dihapus**'
                }]
            }]
        });

        mockReplyRepository.getReplies = jest.fn().mockImplementation(() => Promise.resolve(undefined));

        await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(InvariantError);

        mockCommentRepository.getComments = jest.fn().mockImplementation(() => Promise.resolve(undefined));

        await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(InvariantError);
    })
})

