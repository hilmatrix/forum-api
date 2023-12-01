const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
        userId: 'hilmatrix',
        body: 'body'
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
        userId: 'hilmatrix',
        title: 'judul',
        body: 12345
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
        userId: 'hilmatrix',
        title: 'judul',
        body: 'badan'
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.userId).toEqual(payload.userId);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
