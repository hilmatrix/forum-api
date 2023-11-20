class ThreadRepository {
    async createThread(userId, title, body, date) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThread(threadId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async addComment(userId, threadId, content, date) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyCommentOwner(userId, commentId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteComment(commentId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async addReply(userId, commentId, content, date) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyReplyOwner(userId, replyId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteReply(replyId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ThreadRepository;
