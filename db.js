require('dotenv').config();
const { Pool } = require('pg');

// connection pool
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASS,
  host: process.env.HOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

pool.connect()
  .then(() => console.log('Successfully connected to database'))
  .catch((err) => console.log('Error connecting to db', err));

module.exports = pool;