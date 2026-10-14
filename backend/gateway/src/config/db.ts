import mysql, { Pool, PoolConnection, ResultSetHeader } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionUri =
  process.env.DATABASE_URL ||
  'mysql://root:@localhost:3306/career_bridge';

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

// Convert PostgreSQL $1, $2, ... placeholders to MySQL ?
export function formatSql(sql: string): string {
  return sql.replace(/\$\d+/g, '?');
}

export class DbClient {
  constructor(public connection: PoolConnection) {}

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const formatted = formatSql(text);
    const [result] = await this.connection.query(formatted, params);

    if (Array.isArray(result)) {
      return {
        rows: result as unknown as T[],
        rowCount: result.length,
      };
    }

    const header = result as ResultSetHeader;
    return {
      rows: [],
      rowCount: header.affectedRows || 0,
    };
  }

  release(): void {
    this.connection.release();
  }
}

// Native MySQL2 Pool
const rawPool: Pool = mysql.createPool({
  uri: connectionUri,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  multipleStatements: true,
  dateStrings: true,
});

export const pool = {
  raw: rawPool,
  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const formatted = formatSql(text);
    const [result] = await rawPool.query(formatted, params);

    if (Array.isArray(result)) {
      return {
        rows: result as unknown as T[],
        rowCount: result.length,
      };
    }

    const header = result as ResultSetHeader;
    return {
      rows: [],
      rowCount: header.affectedRows || 0,
    };
  },
  async connect(): Promise<DbClient> {
    const conn = await rawPool.getConnection();
    return new DbClient(conn);
  },
  async getConnection(): Promise<PoolConnection> {
    return rawPool.getConnection();
  },
  async end(): Promise<void> {
    return rawPool.end();
  },
};

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development' && duration > 200) {
    console.log('[MySQL] Slow query:', { text: text.substring(0, 100), duration, rows: res.rowCount });
  }
  return res;
}

export async function getClient(): Promise<DbClient> {
  return pool.connect();
}

export async function testDbConnection(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT 1 as test');
    return res.rows.length > 0 && (res.rows[0].test === 1 || res.rows[0].test === '1');
  } catch (err: any) {
    console.warn('[MySQL] Connection check failed:', err.message);
    return false;
  }
}
