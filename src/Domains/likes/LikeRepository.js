class LikeRepository {
    async getAllLikes(commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLike(userId, commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async addLike(userId, commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async removeLike(userId, commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = LikeRepository;
