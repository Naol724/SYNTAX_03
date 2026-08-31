/**
 * Base Repository
 * Provides generic CRUD operations that all repositories extend.
 * Keeps common DB logic in one place and avoids duplication.
 */

import { query } from '../config/database';
import { PaginationParams, PaginatedResult } from '../types';

export abstract class BaseRepository<T> {
  protected abstract tableName: string;
  protected abstract primaryKey: string;

  /**
   * Find a single record by primary key
   */
  async findById(id: string): Promise<T | null> {
    const result = await query<T>(
      `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  /**
   * Count records with optional WHERE clause
   */
  async count(whereClause: string = '', params: any[] = []): Promise<number> {
    const sql = `SELECT COUNT(*) as total FROM ${this.tableName}${whereClause ? ` WHERE ${whereClause}` : ''}`;
    const result = await query<{ total: string }>(sql, params);
    return parseInt(result.rows[0]?.total ?? '0', 10);
  }

  /**
   * Delete a record by primary key — returns true if deleted
   */
  async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Check if a record exists
   */
  async exists(id: string): Promise<boolean> {
    const result = await query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE ${this.primaryKey} = $1) as exists`,
      [id]
    );
    return result.rows[0]?.exists ?? false;
  }

  /**
   * Build paginated result wrapper from raw data + total count
   */
  protected buildPaginatedResult<R>(
    data: R[],
    total: number,
    pagination: PaginationParams
  ): PaginatedResult<R> {
    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }
}
