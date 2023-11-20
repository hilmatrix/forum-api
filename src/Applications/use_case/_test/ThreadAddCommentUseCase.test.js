const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadAddCommentUseCase = require('../ThreadAddCommentUseCase');

describe('ThreadAddCommentUseCase', () => {

    it('should orchestrating the add comment action correctly', async () => {
        const useCasePayload = {
            userId: 'hilmatrix',
            threadId: 'thread',
            content: 'konten',
            date: 'tanggal'
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve('comment-12345'));
  
        const addCommentUseCase = new ThreadAddCommentUseCase({threadRepository: mockThreadRepository});

        const commentId = await addCommentUseCase.execute(useCasePayload);

        expect(mockThreadRepository.addComment).toBeCalledWith(
            useCasePayload.userId, useCasePayload.threadId, useCasePayload.content, useCasePayload.date);

        expect(commentId).toStrictEqual('comment-12345');
    })
})
