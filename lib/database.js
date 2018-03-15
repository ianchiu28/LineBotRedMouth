var {
    Pool
} = require('pg');

var pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

exports.pool = pool;