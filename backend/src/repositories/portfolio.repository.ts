/**
 * Portfolio Repository
 * All database operations for the portfolio table.
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { Portfolio, CreatePortfolioDTO, UpdatePortfolioDTO, PaginationParams, PaginatedResult } from '../types';

export class PortfolioRepository extends BaseRepository<Portfolio> {
  protected tableName = 'portfolio';
  protected primaryKey = 'portfolio_id';

  async create(admin_id: string, dto: CreatePortfolioDTO): Promise<Portfolio> {
    const result = await query<Portfolio>(
      `INSERT INTO portfolio
         (admin_id, project_name, portfolio_type, description, short_description,
          language_used, project_link, github_link, image_url, thumbnail_url,
          client_name, completion_date, is_featured, is_published, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        admin_id,
        dto.project_name,
        dto.portfolio_type,
        dto.description,
        dto.short_description ?? null,
        dto.language_used ?? null,
        dto.project_link ?? null,
        dto.github_link ?? null,
        dto.image_url ?? null,
        dto.thumbnail_url ?? null,
        dto.client_name ?? null,
        dto.completion_date ?? null,
        dto.is_featured ?? false,
        dto.is_published ?? true,
        dto.display_order ?? 0,
      ]
    );
    return result.rows[0];
  }

  async update(portfolio_id: string, dto: UpdatePortfolioDTO): Promise<Portfolio | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const updatable: (keyof UpdatePortfolioDTO)[] = [
      'project_name', 'portfolio_type', 'description', 'short_description',
      'language_used', 'project_link', 'github_link', 'image_url', 'thumbnail_url',
      'client_name', 'completion_date', 'is_featured', 'is_published', 'display_order',
    ];

    for (const key of updatable) {
      if (dto[key] !== undefined) {
        fields.push(`${String(key)} = $${idx++}`);
        values.push(dto[key]);
      }
    }

    if (fields.length === 0) return this.findById(portfolio_id);

    values.push(portfolio_id);
    const result = await query<Portfolio>(
      `UPDATE portfolio SET ${fields.join(', ')} WHERE portfolio_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  async findAllPublished(
    pagination: PaginationParams,
    filters?: { type?: string; language?: string }
  ): Promise<PaginatedResult<Portfolio>> {
    const conditions: string[] = ['is_published = true'];
    const params: any[] = [];
    let idx = 1;

    if (filters?.type) {
      conditions.push(`portfolio_type = $${idx++}`);
      params.push(filters.type);
    }
    if (filters?.language) {
      conditions.push(`$${idx++} = ANY(language_used)`);
      params.push(filters.language);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const [rows, total] = await Promise.all([
      query<Portfolio>(
        `SELECT * FROM portfolio ${where}
         ORDER BY display_order ASC, created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, pagination.limit, pagination.offset]
      ),
      this.count(conditions.join(' AND '), params),
    ]);

    return this.buildPaginatedResult(rows.rows, total, pagination);
  }

  async findAll(pagination: PaginationParams, search?: string): Promise<PaginatedResult<Portfolio>> {
    const params: any[] = [];
    let where = '';
    if (search) {
      where = `WHERE project_name ILIKE $1 OR description ILIKE $1`;
      params.push(`%${search}%`);
    }

    const [rows, total] = await Promise.all([
      query<Portfolio>(
        `SELECT * FROM portfolio ${where} ORDER BY created_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, pagination.limit, pagination.offset]
      ),
      this.count(search ? `project_name ILIKE $1 OR description ILIKE $1` : '', search ? [`%${search}%`] : []),
    ]);

    return this.buildPaginatedResult(rows.rows, total, pagination);
  }

  async findFeatured(): Promise<Portfolio[]> {
    const result = await query<Portfolio>(
      `SELECT * FROM portfolio WHERE is_featured = true AND is_published = true
       ORDER BY display_order ASC LIMIT 6`
    );
    return result.rows;
  }

  async incrementViews(portfolio_id: string): Promise<void> {
    await query(
      'UPDATE portfolio SET views_count = views_count + 1 WHERE portfolio_id = $1',
      [portfolio_id]
    );
  }
}

export const portfolioRepository = new PortfolioRepository();
