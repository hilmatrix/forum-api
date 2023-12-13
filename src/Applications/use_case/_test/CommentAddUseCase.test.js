const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentAddUseCase = require('../CommentAddUseCase');

describe('CommentAddUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      userId: 'user-12345',
      username: 'hilmatrix',
      threadId: 'thread-12345',
      content: 'konten',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve('comment-12345'));

    const addCommentUseCase = new CommentAddUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const comment = await addCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(useCasePayload.userId, useCasePayload.threadId, useCasePayload.content);

    expect(comment).toStrictEqual({
      id: 'comment-12345',
      content: 'konten',
      owner: 'hilmatrix',
    });
  });
});
