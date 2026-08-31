/**
 * Service Repository
 * All database operations for the services table.
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { Service, CreateServiceDTO, UpdateServiceDTO, PaginationParams, PaginatedResult } from '../types';

export class ServiceRepository extends BaseRepository<Service> {
  protected tableName = 'services';
  protected primaryKey = 'service_id';

  async create(admin_id: string, dto: CreateServiceDTO): Promise<Service> {
    const result = await query<Service>(
      `INSERT INTO services
         (admin_id, name, type, description, short_description, language, property, icon_url, is_active, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        admin_id,
        dto.name,
        dto.type,
        dto.description,
        dto.short_description ?? null,
        dto.language ?? null,
        dto.property ? JSON.stringify(dto.property) : null,
        dto.icon_url ?? null,
        dto.is_active ?? true,
        dto.display_order ?? 0,
      ]
    );
    return result.rows[0];
  }

  async update(service_id: string, dto: UpdateServiceDTO): Promise<Service | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (dto.name !== undefined)              { fields.push(`name = $${idx++}`);              values.push(dto.name); }
    if (dto.type !== undefined)              { fields.push(`type = $${idx++}`);              values.push(dto.type); }
    if (dto.description !== undefined)       { fields.push(`description = $${idx++}`);       values.push(dto.description); }
    if (dto.short_description !== undefined) { fields.push(`short_description = $${idx++}`); values.push(dto.short_description); }
    if (dto.language !== undefined)          { fields.push(`language = $${idx++}`);          values.push(dto.language); }
    if (dto.property !== undefined)          { fields.push(`property = $${idx++}`);          values.push(JSON.stringify(dto.property)); }
    if (dto.icon_url !== undefined)          { fields.push(`icon_url = $${idx++}`);          values.push(dto.icon_url); }
    if (dto.is_active !== undefined)         { fields.push(`is_active = $${idx++}`);         values.push(dto.is_active); }
    if (dto.display_order !== undefined)     { fields.push(`display_order = $${idx++}`);     values.push(dto.display_order); }

    if (fields.length === 0) return this.findById(service_id);

    values.push(service_id);
    const result = await query<Service>(
      `UPDATE services SET ${fields.join(', ')} WHERE service_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  /** Public: active services ordered by display_order */
  async findAllActive(): Promise<Service[]> {
    const result = await query<Service>(
      `SELECT * FROM services WHERE is_active = true ORDER BY display_order ASC, created_at DESC`
    );
    return result.rows;
  }

  /** Admin: all services, paginated */
  async findAll(pagination: PaginationParams, search?: string): Promise<PaginatedResult<Service>> {
    const params: any[] = [];
    let where = '';
    if (search) {
      where = `WHERE name ILIKE $1 OR description ILIKE $1`;
      params.push(`%${search}%`);
    }

    const [rows, total] = await Promise.all([
      query<Service>(
        `SELECT * FROM services ${where} ORDER BY display_order ASC, created_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, pagination.limit, pagination.offset]
      ),
      this.count(search ? `name ILIKE $1 OR description ILIKE $1` : '', search ? [`%${search}%`] : []),
    ]);

    return this.buildPaginatedResult(rows.rows, total, pagination);
  }
}

export const serviceRepository = new ServiceRepository();
