import mysql from 'mysql2/promise';

let connection;

export const createConnection = async () => {
  if (!connection) {
      connection = await mysql.createConnection({
        host: process.env.DEV_HOST,
        port: process.env.DEV_PORT,
        user: process.env.DEV_USER,
        password: process.env.DEV_PASSWORD,
        database: process.env.DBNAME
      });
  }

  return connection;
}