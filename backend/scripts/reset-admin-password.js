/**
 * Reset Admin Password Script
 * Updates the admin password with a fresh bcrypt hash.
 * Run: node scripts/reset-admin-password.js
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const TARGET_EMAIL = 'admin@syntax.com';
const NEW_PASSWORD = 'Admin@Syntax2026!';

async function resetPassword() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const hash = await bcrypt.hash(NEW_PASSWORD, 12);
    const result = await pool.query(
      `UPDATE admins SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
       WHERE email = $2 RETURNING admin_id, email`,
      [hash, TARGET_EMAIL]
    );

    if (result.rows.length === 0) {
      console.log('❌ Admin not found:', TARGET_EMAIL);
      console.log('   Run: node scripts/seed-admin.js first');
    } else {
      console.log('✅ Password reset for:', result.rows[0].email);
      console.log('   New password:', NEW_PASSWORD);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

resetPassword();
