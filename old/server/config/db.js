const { Pool } = require("pg"); //imports Postgre connection pool

//use supabase connection string from env.
//ssl is required for secure connection to supabase, but rejectUnauthorized is set to false to allow self-signed certificates. 
//family: 4 forces the use of IPv4, which is necessary for some environments that do not support IPv6.

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4
});

module.exports = pool; //exports the pool for use in other parts of the application, such as in route handlers to execute database queries.

// Connect to the database and log the connection status. This is useful for debugging and ensuring that the application can connect to the database when it starts.
pool.connect()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection error", err));