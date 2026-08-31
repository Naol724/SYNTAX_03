/**
 * Admin Repository
 * All database operations for the admins table.
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { Admin, CreateAdminDTO, UpdateAdminDTO } from '../types';

export class AdminRepository extends BaseRepository<Admin> {
  protected tableName = 'admins';
  protected primaryKey = 'admin_id';

  async findByEmail(email: string): Promise<Admin | null> {
    const result = await query<Admin>(
      'SELECT * FROM admins WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0] ?? null;
  }

  async findByUsername(username: string): Promise<Admin | null> {
    const result = await query<Admin>(
      'SELECT * FROM admins WHERE username = $1 AND is_active = true',
      [username]
    );
    return result.rows[0] ?? null;
  }

  async create(dto: CreateAdminDTO & { password_hash: string }): Promise<Admin> {
    const result = await query<Admin>(
      `INSERT INTO admins (username, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [dto.username, dto.email, dto.password_hash, dto.full_name, dto.role ?? 'admin']
    );
    return result.rows[0];
  }

  async update(admin_id: string, dto: UpdateAdminDTO): Promise<Admin | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (dto.full_name !== undefined) { fields.push(`full_name = $${idx++}`); values.push(dto.full_name); }
    if (dto.email !== undefined) { fields.push(`email = $${idx++}`); values.push(dto.email); }
    if (dto.username !== undefined) { fields.push(`username = $${idx++}`); values.push(dto.username); }
    if (dto.role !== undefined) { fields.push(`role = $${idx++}`); values.push(dto.role); }
    if (dto.is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(dto.is_active); }

    if (fields.length === 0) return this.findById(admin_id);

    values.push(admin_id);
    const result = await query<Admin>(
      `UPDATE admins SET ${fields.join(', ')} WHERE admin_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  async updatePassword(admin_id: string, password_hash: string): Promise<boolean> {
    const result = await query(
      'UPDATE admins SET password_hash = $1 WHERE admin_id = $2',
      [password_hash, admin_id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async updateLastLogin(admin_id: string): Promise<void> {
    await query(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE admin_id = $1',
      [admin_id]
    );
  }

  async findAll(): Promise<Omit<Admin, 'password_hash'>[]> {
    const result = await query<Omit<Admin, 'password_hash'>>(
      `SELECT admin_id, username, email, full_name, role, is_active, last_login, created_at, updated_at
       FROM admins ORDER BY created_at DESC`
    );
    return result.rows;
  }
}

export const adminRepository = new AdminRepository();
