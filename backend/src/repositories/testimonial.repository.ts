/**
 * Testimonial Repository
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { Testimonial, CreateTestimonialDTO, UpdateTestimonialDTO, PaginationParams, PaginatedResult } from '../types';

export class TestimonialRepository extends BaseRepository<Testimonial> {
  protected tableName = 'testimonials';
  protected primaryKey = 'testimonial_id';

  async create(admin_id: string, dto: CreateTestimonialDTO): Promise<Testimonial> {
    const result = await query<Testimonial>(
      `INSERT INTO testimonials
         (admin_id, portfolio_id, client_name, project_type, position_work, company_name,
          location, feedback, rating, avatar_url, is_featured, is_approved, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        admin_id,
        dto.portfolio_id ?? null,
        dto.client_name,
        dto.project_type ?? null,
        dto.position_work ?? null,
        dto.company_name ?? null,
        dto.location ?? null,
        dto.feedback,
        dto.rating,
        dto.avatar_url ?? null,
        dto.is_featured ?? false,
        dto.is_approved ?? false,
        dto.display_order ?? 0,
      ]
    );
    return result.rows[0];
  }

  async update(testimonial_id: string, dto: UpdateTestimonialDTO): Promise<Testimonial | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const updatable: (keyof UpdateTestimonialDTO)[] = [
      'client_name', 'project_type', 'position_work', 'company_name', 'location',
      'feedback', 'rating', 'avatar_url', 'is_featured', 'is_approved', 'display_order', 'portfolio_id',
    ];

    for (const key of updatable) {
      if (dto[key] !== undefined) {
        fields.push(`${String(key)} = $${idx++}`);
        values.push(dto[key]);
      }
    }

    if (fields.length === 0) return this.findById(testimonial_id);

    values.push(testimonial_id);
    const result = await query<Testimonial>(
      `UPDATE testimonials SET ${fields.join(', ')} WHERE testimonial_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  async findApproved(pagination: PaginationParams): Promise<PaginatedResult<Testimonial>> {
    const [rows, total] = await Promise.all([
      query<Testimonial>(
        `SELECT * FROM testimonials WHERE is_approved = true
         ORDER BY display_order ASC, created_at DESC
         LIMIT $1 OFFSET $2`,
        [pagination.limit, pagination.offset]
      ),
      this.count('is_approved = true'),
    ]);
    return this.buildPaginatedResult(rows.rows, total, pagination);
  }

  async findFeatured(): Promise<Testimonial[]> {
    const result = await query<Testimonial>(
      `SELECT * FROM testimonials WHERE is_featured = true AND is_approved = true
       ORDER BY display_order ASC LIMIT 6`
    );
    return result.rows;
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Testimonial>> {
    const [rows, total] = await Promise.all([
      query<Testimonial>(
        `SELECT * FROM testimonials ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [pagination.limit, pagination.offset]
      ),
      this.count(),
    ]);
    return this.buildPaginatedResult(rows.rows, total, pagination);
  }
}

export const testimonialRepository = new TestimonialRepository();
