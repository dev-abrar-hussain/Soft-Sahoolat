import mysql, { type Pool, type PoolOptions } from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var softSahoolatPool: Pool | undefined;
}

function databaseOptions(): PoolOptions {
  const connection = process.env.DATABASE_URL;
  if (!connection) throw new Error('DATABASE_URL is not configured.');
  const parsed = new URL(connection);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
    charset: 'utf8mb4',
    dateStrings: true,
    connectionLimit: 8,
    enableKeepAlive: true,
  };
}

export function db(): Pool {
  if (!global.softSahoolatPool) global.softSahoolatPool = mysql.createPool(databaseOptions());
  return global.softSahoolatPool;
}

