const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadAddReplyUseCase = require('../ThreadAddReplyUseCase');

describe('ThreadAddReplyUseCase', () => {

    it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
            userId: 'hilmatrix',
            commentId: 'thread',
            content: 'konten',
            date: 'tanggal'
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve('reply-12345'));
  
        const addReplyUseCase = new ThreadAddReplyUseCase({threadRepository: mockThreadRepository});

        const replyId = await addReplyUseCase.execute(useCasePayload);

        expect(mockThreadRepository.addReply).toBeCalledWith(
            useCasePayload.userId, useCasePayload.commentId, useCasePayload.content, useCasePayload.date);

        expect(replyId).toStrictEqual('reply-12345');
    })
})
