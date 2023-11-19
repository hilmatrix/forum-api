/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        user_id: {
            type: 'TEXT',
            notNull: true,
        },
        title: {
          type: 'TEXT',
          notNull: true,
          unique: true,
        },
        body: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: 'TEXT',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('threads');
};
