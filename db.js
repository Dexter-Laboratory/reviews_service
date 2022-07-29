require('dotenv').config();
const { Pool } = require('pg');

// connection pool
const pool = new Pool();

pool.connect()
  .then(() => console.log('Successfully connected to database'))
  .catch((err) => console.log('Error connecting to db', err));

module.exports = pool;