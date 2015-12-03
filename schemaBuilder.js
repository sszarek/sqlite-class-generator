var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./mydb.sqlite"
    }
});

knex.schema
    .createTable('users', function (table) {
        table.increments('userId');
        table.string('name');
        table.string('lastName');
        table.integer('age');
    })
    .createTable('orders', function (table) {
        table.increments('orderId');
        table.integer('userId').references('userId').inTable('users');
    })
    .then(() => console.log('done creating schema'));
    