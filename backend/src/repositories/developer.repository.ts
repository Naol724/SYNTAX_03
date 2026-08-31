/**
 * Developer Repository
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { Developer, CreateDeveloperDTO, UpdateDeveloperDTO, PaginationParams, PaginatedResult } from '../types';

export class DeveloperRepository extends BaseRepository<Developer> {
  protected tableName = 'developers';
  protected primaryKey = 'developer_id';

  async create(admin_id: string, dto: CreateDeveloperDTO): Promise<Developer> {
    const result = await query<Developer>(
      `INSERT INTO developers
         (admin_id, full_name, skill, position, bio, avatar_url, email,
          phone_number, social_media_links, years_of_experience, is_active, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        admin_id,
        dto.full_name,
        dto.skill,
        dto.position,
        dto.bio ?? null,
        dto.avatar_url ?? null,
        dto.email ?? null,
        dto.phone_number ?? null,
        dto.social_media_links ? JSON.stringify(dto.social_media_links) : null,
        dto.years_of_experience ?? null,
        dto.is_active ?? true,
        dto.display_order ?? 0,
      ]
    );
    return result.rows[0];
  }

  async update(developer_id: string, dto: UpdateDeveloperDTO): Promise<Developer | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (dto.full_name !== undefined)          { fields.push(`full_name = $${idx++}`);          values.push(dto.full_name); }
    if (dto.skill !== undefined)              { fields.push(`skill = $${idx++}`);              values.push(dto.skill); }
    if (dto.position !== undefined)           { fields.push(`position = $${idx++}`);           values.push(dto.position); }
    if (dto.bio !== undefined)                { fields.push(`bio = $${idx++}`);                values.push(dto.bio); }
    if (dto.avatar_url !== undefined)         { fields.push(`avatar_url = $${idx++}`);         values.push(dto.avatar_url); }
    if (dto.email !== undefined)              { fields.push(`email = $${idx++}`);              values.push(dto.email); }
    if (dto.phone_number !== undefined)       { fields.push(`phone_number = $${idx++}`);       values.push(dto.phone_number); }
    if (dto.social_media_links !== undefined) { fields.push(`social_media_links = $${idx++}`); values.push(JSON.stringify(dto.social_media_links)); }
    if (dto.years_of_experience !== undefined){ fields.push(`years_of_experience = $${idx++}`);values.push(dto.years_of_experience); }
    if (dto.is_active !== undefined)          { fields.push(`is_active = $${idx++}`);          values.push(dto.is_active); }
    if (dto.display_order !== undefined)      { fields.push(`display_order = $${idx++}`);      values.push(dto.display_order); }

    if (fields.length === 0) return this.findById(developer_id);

    values.push(developer_id);
    const result = await query<Developer>(
      `UPDATE developers SET ${fields.join(', ')} WHERE developer_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  async findAllActive(): Promise<Developer[]> {
    const result = await query<Developer>(
      `SELECT * FROM developers WHERE is_active = true ORDER BY display_order ASC, created_at DESC`
    );
    return result.rows;
  }

  async findAll(pagination: PaginationParams, search?: string): Promise<PaginatedResult<Developer>> {
    const params: any[] = [];
    let where = '';
    if (search) {
      where = `WHERE full_name ILIKE $1 OR position ILIKE $1`;
      params.push(`%${search}%`);
    }

    const [rows, total] = await Promise.all([
      query<Developer>(
        `SELECT * FROM developers ${where} ORDER BY display_order ASC, created_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, pagination.limit, pagination.offset]
      ),
      this.count(search ? `full_name ILIKE $1 OR position ILIKE $1` : '', search ? [`%${search}%`] : []),
    ]);

    return this.buildPaginatedResult(rows.rows, total, pagination);
  }
}

export const developerRepository = new DeveloperRepository();
