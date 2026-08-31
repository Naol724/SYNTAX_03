/**
 * User Repository
 * All database operations for the users table.
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { User, CreateUserDTO, PaginationParams, PaginatedResult } from '../types';

export class UserRepository extends BaseRepository<User> {
  protected tableName = 'users';
  protected primaryKey = 'user_id';

  async findByEmail(email: string): Promise<User | null> {
    const result = await query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] ?? null;
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const result = await query<User>(
      `INSERT INTO users (email, full_name, phone_number, company_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [dto.email, dto.full_name, dto.phone_number ?? null, dto.company_name ?? null]
    );
    return result.rows[0];
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<User>> {
    const [rows, total] = await Promise.all([
      query<User>(
        `SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [pagination.limit, pagination.offset]
      ),
      this.count(),
    ]);
    return this.buildPaginatedResult(rows.rows, total, pagination);
  }

  async updateLastActivity(user_id: string): Promise<void> {
    await query(
      'UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user_id]
    );
  }
}

export const userRepository = new UserRepository();
