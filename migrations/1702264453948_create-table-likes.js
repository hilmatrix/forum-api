/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'TEXT',
      notNull: true,
    },
    comment_id: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'likes',
    'fk_likes.comment_id_pk_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes.comment_id_pk_comments.id');
  pgm.dropTable('likes');
};
