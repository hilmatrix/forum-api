const NewComment = require('../NewComment');

describe('NewThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      userId: 'hilmatrix',
      threadId: 'thread',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 'hilmatrix',
      threadId: 'thread',
      content: 3.14,
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      userId: 'hilmatrix',
      threadId: 'thread',
      content: 'konten',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.userId).toEqual(payload.userId);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.content).toEqual(payload.content);
  });
});
