import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(__dirname, '../.env.local') });

import { connectDB } from '../lib/mongoose';
import User from '../models/User';

async function seedAdmin() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@syntax.com' });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      return;
    }

    // Create admin user
    const admin = await User.create({
      email: 'admin@syntax.com',
      password: 'admin123', // Will be hashed automatically
      name: 'Admin User',
      role: 'super_admin',
      isActive: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    console.log('-----------------------------------');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('Login at: http://localhost:5000/admin/login');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
