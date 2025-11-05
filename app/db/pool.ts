import { Pool } from 'pg';

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (_pool) return _pool;
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    // Defer throwing until actually used
    throw new Error('Database connection string (SUPABASE_DB_URL) is not set');
  }
  _pool = new Pool({ connectionString });
  const schema = process.env.SUPABASE_SCHEMA || 'public';
  _pool.on('connect', (client) => {
    client.query(`set search_path to ${schema}`);
  });
  return _pool;
}
