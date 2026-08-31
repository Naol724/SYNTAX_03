const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function checkDb() {
  try {
    // List tables
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    console.log('✅ Tables found:', tables.rows.length);
    tables.rows.forEach((r) => console.log('  -', r.table_name));

    // Check admin exists
    const admins = await pool.query('SELECT COUNT(*) as count FROM admins');
    console.log('\n✅ Admins in DB:', admins.rows[0].count);

    // Check all required tables
    const required = ['admins','users','services','portfolio','blog','testimonials','developers','messages','ai_chat_assistant','refresh_tokens'];
    const found = tables.rows.map((r) => r.table_name);
    const missing = required.filter((t) => !found.includes(t));
    if (missing.length === 0) {
      console.log('\n✅ All required tables present!');
    } else {
      console.log('\n⚠️  Missing tables:', missing.join(', '));
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
  }
}

checkDb();
