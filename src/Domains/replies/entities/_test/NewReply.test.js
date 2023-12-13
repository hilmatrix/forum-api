const NewReply = require('../NewReply');

describe('NewThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      userId: 'hilmatrix',
      commentId: 'komen',
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 'hilmatrix',
      commentId: true,
      content: 'konten',
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply entities correctly', () => {
    // Arrange
    const payload = {
      userId: 'hilmatrix',
      commentId: 'komen',
      content: 'konten',
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply).toBeInstanceOf(NewReply);
    expect(newReply.userId).toEqual(payload.userId);
    expect(newReply.commentId).toEqual(payload.commentId);
    expect(newReply.content).toEqual(payload.content);
  });
});
