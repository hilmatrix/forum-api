/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        user_id: {
            type: 'TEXT',
            notNull: true,
        },
        thread_id: {
            type: 'TEXT',
            notNull: true,
        },
        content: {
          type: 'TEXT',
          notNull: true,
        },
        deleted: {
            type: 'bool',
            notNull: true,
        },
        date: {
            type: 'TEXT',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('comments');
};
