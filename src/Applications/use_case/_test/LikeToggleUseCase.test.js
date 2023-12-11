const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

const LikeToggleUseCase = require('../LikeToggleUseCase');

describe('LikeToggleUseCase', () => {

    it('it should call addLike if getLike return none', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            threadId: 'thread-12345',
            commentId: 'comment-12345',
        };

        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();

        const likeToggleUseCase = new LikeToggleUseCase({
            commentRepository: mockCommentRepository,likeRepository: mockLikeRepository});

        mockCommentRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockLikeRepository.getLike = jest.fn().mockImplementation(() => Promise.resolve());
        mockLikeRepository.addLike = jest.fn().mockImplementation(() => Promise.resolve());

        await likeToggleUseCase.execute(useCasePayload);

        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockLikeRepository.getLike).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
        expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    })

    it('it should call removeLike if getLike return something', async () => {
        const useCasePayload = {
            userId: 'user-12345',
            threadId: 'thread-12345',
            commentId: 'comment-12345',
        };

        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();

        const likeToggleUseCase = new LikeToggleUseCase({
            commentRepository: mockCommentRepository,likeRepository: mockLikeRepository});
        
        mockCommentRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockLikeRepository.getLike = jest.fn().mockImplementation(() => Promise.resolve({
            id : 'like-12345',
            user_id : 'user-penyuka',
            comment_id : 'comment-12345'
        }));
        mockLikeRepository.removeLike = jest.fn().mockImplementation(() => Promise.resolve());

        await likeToggleUseCase.execute(useCasePayload);

        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockLikeRepository.getLike).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
        expect(mockLikeRepository.removeLike).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    })
})
