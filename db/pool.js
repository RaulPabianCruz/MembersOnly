const { Pool } = require('pg');

let connectionString;
if(process.env.NODE_ENV === 'prod')
    connectionString = DATABASE_URL;
else
    connectionString = process.env.CONNECTION_STRING;

module.exports = new Pool({connectionString: connectionString});
