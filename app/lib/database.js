import mysql from 'mysql2/promise';

let connection;

export const createConnection = async () => {
  if (!connection) {
      connection = await mysql.createConnection({
        host: process.env.PROD_HOST,
        port: process.env.PROD_PORT,
        user: process.env.PROD_USER,
        password: process.env.PROD_PASSWORD,
        database: process.env.DBNAME
      });
  }

  return connection;
}