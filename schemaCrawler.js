var Promise = require('bluebird'),
    Handlebars = require('handlebars'),
    _ = require('lodash'),
    fs = Promise.promisifyAll(require('fs')),
    join = require('path').join,
    knex = require('knex')({
        client: 'sqlite3',
        connection: {
            filename: "./mydb.sqlite"
        },
        pool: {
            min: 0,
            max: 1
        }
    });

const output_dir = 'output';
fs.mkdirAsync(output_dir)
    .catch(err => {
        if (err.code !== 'EEXIST') {
            console.error(err);
        }
    });

var source = fs.readFileSync('classTemplate.handlebars', 'utf8');
var template = Handlebars.compile(source);

knex.select('*')
    .from('sqlite_master')
    .where('type', 'table')
    .map(function (row) {
        console.log(row.name);
        return knex.raw(`pragma table_info(${row.name})`)
            .then(columns => writeTableColumns(row.name, columns));
    })
    .then(() => console.log('Finished generating classes'))
    .then(knex.destroy);

function writeTableColumns(table, columns) {
    var generated = template({
        className: table,
        properties: _.pluck(columns, 'name')
    });

    fs.writeFileAsync(join(output_dir, `${table}.js`), generated);
}

