
class LikeToggleUseCase {
    constructor({commentRepository, likeRepository}) {
      this.commentRepository = commentRepository;
      this.likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        await this.commentRepository.verifyCommentExist(useCasePayload.threadId, useCasePayload.commentId);
        const like = await this.likeRepository.getLike(useCasePayload.userId, useCasePayload.commentId);

        if (!like) 
            await this.likeRepository.addLike(useCasePayload.userId, useCasePayload.commentId);
        else
            await this.likeRepository.removeLike(useCasePayload.userId, useCasePayload.commentId);
    }
}

module.exports = LikeToggleUseCase;
