/**
 * Refresh Token Repository
 * Manages JWT refresh token storage and revocation.
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { RefreshToken, CreateRefreshTokenDTO } from '../types';

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  protected tableName = 'refresh_tokens';
  protected primaryKey = 'token_id';

  async create(dto: CreateRefreshTokenDTO): Promise<RefreshToken> {
    const result = await query<RefreshToken>(
      `INSERT INTO refresh_tokens (admin_id, token_hash, expires_at, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [dto.admin_id, dto.token_hash, dto.expires_at, dto.user_agent ?? null, dto.ip_address ?? null]
    );
    return result.rows[0];
  }

  async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    const result = await query<RefreshToken>(
      `SELECT * FROM refresh_tokens
       WHERE token_hash = $1 AND is_revoked = false AND expires_at > CURRENT_TIMESTAMP`,
      [tokenHash]
    );
    return result.rows[0] ?? null;
  }

  async revokeByHash(tokenHash: string): Promise<boolean> {
    const result = await query(
      `UPDATE refresh_tokens
       SET is_revoked = true, revoked_at = CURRENT_TIMESTAMP
       WHERE token_hash = $1`,
      [tokenHash]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async revokeAllForAdmin(admin_id: string): Promise<void> {
    await query(
      `UPDATE refresh_tokens
       SET is_revoked = true, revoked_at = CURRENT_TIMESTAMP
       WHERE admin_id = $1 AND is_revoked = false`,
      [admin_id]
    );
  }

  async cleanupExpired(): Promise<number> {
    const result = await query(
      `DELETE FROM refresh_tokens
       WHERE expires_at < CURRENT_TIMESTAMP OR is_revoked = true`
    );
    return result.rowCount ?? 0;
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
