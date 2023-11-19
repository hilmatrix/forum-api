/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addConstraint('comments', 'fk_comments.thread_id_pk_threads.id', 
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
    pgm.addConstraint('replies', 'fk_replies.comment_id_pk_comments.id', 
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('comments', 'fk_comments.thread_id_pk_threads.id');
    pgm.dropConstraint('replies', 'fk_replies.comment_id_pk_comments.id');
};
