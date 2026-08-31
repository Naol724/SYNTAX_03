/**
 * Database Configuration
 * PostgreSQL connection pool setup using node-postgres (pg).
 * Supports both direct connection string and individual params.
 */

import { Pool, PoolClient } from 'pg';
import config from './environment';
import logger from '../utils/logger';

// =====================================================
// CONNECTION POOL
// =====================================================
const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  max: config.database.pool.max,
  idleTimeoutMillis: config.database.pool.idleTimeoutMillis,
  connectionTimeoutMillis: config.database.pool.connectionTimeoutMillis,
  // Keep connections alive for Supabase pooler
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// =====================================================
// POOL EVENT HANDLERS
// =====================================================
pool.on('connect', (_client: PoolClient) => {
  logger.debug('New database client connected');
});

pool.on('error', (err: Error) => {
  logger.error('Unexpected database error on idle client', { error: err.message });
  process.exit(-1);
});

pool.on('acquire', () => {
  logger.debug('Client acquired from pool');
});

pool.on('remove', () => {
  logger.debug('Client removed from pool');
});

// =====================================================
// DATABASE HELPER FUNCTIONS
// =====================================================

/**
 * Execute a query with optional parameters.
 * Auto-retries once on connection timeout (Supabase pooler drops idle connections).
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  const start = Date.now();
  const attempt = async () => {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (config.server.isDevelopment) {
      logger.debug('Query executed', {
        query: text.substring(0, 100),
        duration: `${duration}ms`,
        rowCount: result.rowCount,
      });
    }
    return { rows: result.rows as T[], rowCount: result.rowCount };
  };

  try {
    return await attempt();
  } catch (error) {
    const err = error as any;
    // Retry once on connection timeout — pooler may have dropped idle connection
    if (err.message?.includes('timeout') || err.code === 'ECONNRESET') {
      logger.warn('DB connection issue, retrying query once...', { error: err.message });
      return await attempt();
    }
    logger.error('Database query error', {
      query: text.substring(0, 100),
      error: err.message,
    });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

/**
 * Execute a transaction - auto rollback on error
 */
export async function transaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Test database connectivity
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query<{ now: Date }>('SELECT NOW() as now');
    logger.info('✅ Database connected successfully', {
      timestamp: result.rows[0]?.now,
    });
    return true;
  } catch (error) {
    const err = error as Error;
    logger.error('❌ Database connection failed', { error: err.message });
    return false;
  }
}

/**
 * Close all pool connections gracefully
 */
export async function closePool(): Promise<void> {
  await pool.end();
  logger.info('Database pool closed');
}

export { pool };
export default pool;
