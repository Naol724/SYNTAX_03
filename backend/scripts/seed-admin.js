/**
 * Seed Admin Script
 * Creates the initial super admin with a bcrypt-hashed password.
 * Run once: node scripts/seed-admin.js
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const ADMIN = {
  username: 'admin',
  email: 'admin@syntax.com',
  password: 'Admin@Syntax2026!',   // Change this after first login
  full_name: 'System Administrator',
  role: 'super_admin',
};

async function seedAdmin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Check if admin already exists
    const existing = await pool.query(
      'SELECT admin_id, email FROM admins WHERE email = $1',
      [ADMIN.email]
    );

    if (existing.rows.length > 0) {
      console.log('⚠️  Admin already exists:', existing.rows[0].email);
      console.log('   To reset password, run: node scripts/reset-admin-password.js');
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(ADMIN.password, 12);

    // Insert admin
    const result = await pool.query(
      `INSERT INTO admins (username, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING admin_id, email, username, role`,
      [ADMIN.username, ADMIN.email, passwordHash, ADMIN.full_name, ADMIN.role]
    );

    console.log('✅ Admin created successfully!');
    console.log('   ID:', result.rows[0].admin_id);
    console.log('   Email:', result.rows[0].email);
    console.log('   Username:', result.rows[0].username);
    console.log('   Role:', result.rows[0].role);
    console.log('\n🔑 Login credentials:');
    console.log('   Email:', ADMIN.email);
    console.log('   Password:', ADMIN.password);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  } finally {
    await pool.end();
  }
}

seedAdmin();
