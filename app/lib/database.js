import mysql from 'mysql2/promise';

let pool;

export const createConnection = async () => {
  if (!pool) {
      pool = mysql.createPool({
        host: process.env.PROD_HOST,
        port: process.env.PROD_PORT,
        user: process.env.PROD_USER,
        password: process.env.PROD_PASSWORD,
        database: process.env.DBNAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
  }

  return pool;
}