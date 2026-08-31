/**
 * Blog Repository
 * All database operations for the blog table.
 */

import { query } from '../config/database';
import { BaseRepository } from './base.repository';
import { Blog, CreateBlogDTO, UpdateBlogDTO, PaginationParams, PaginatedResult } from '../types';

export class BlogRepository extends BaseRepository<Blog> {
  protected tableName = 'blog';
  protected primaryKey = 'blog_id';

  async create(admin_id: string, dto: CreateBlogDTO): Promise<Blog> {
    const result = await query<Blog>(
      `INSERT INTO blog
         (admin_id, title, slug, content, excerpt, category, tags, featured_image_url,
          author_name, publish_date, is_published, is_featured, read_time_minutes,
          seo_title, seo_description, seo_keywords)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING *`,
      [
        admin_id,
        dto.title,
        dto.slug!,
        dto.content,
        dto.excerpt ?? null,
        dto.category,
        dto.tags ?? null,
        dto.featured_image_url ?? null,
        dto.author_name ?? null,
        dto.publish_date ?? null,
        dto.is_published ?? false,
        dto.is_featured ?? false,
        dto.read_time_minutes ?? null,
        dto.seo_title ?? null,
        dto.seo_description ?? null,
        dto.seo_keywords ?? null,
      ]
    );
    return result.rows[0];
  }

  async update(blog_id: string, dto: UpdateBlogDTO): Promise<Blog | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const updatable: (keyof UpdateBlogDTO)[] = [
      'title', 'slug', 'content', 'excerpt', 'category', 'tags',
      'featured_image_url', 'author_name', 'publish_date', 'is_published',
      'is_featured', 'read_time_minutes', 'seo_title', 'seo_description', 'seo_keywords',
    ];

    for (const key of updatable) {
      if (dto[key] !== undefined) {
        fields.push(`${String(key)} = $${idx++}`);
        values.push(dto[key]);
      }
    }

    if (fields.length === 0) return this.findById(blog_id);

    values.push(blog_id);
    const result = await query<Blog>(
      `UPDATE blog SET ${fields.join(', ')} WHERE blog_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    const result = await query<Blog>(
      'SELECT * FROM blog WHERE slug = $1',
      [slug]
    );
    return result.rows[0] ?? null;
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const params: any[] = [slug];
    const exclude = excludeId ? ` AND blog_id != $2` : '';
    if (excludeId) params.push(excludeId);
    const result = await query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM blog WHERE slug = $1${exclude}) as exists`,
      params
    );
    return result.rows[0]?.exists ?? false;
  }

  async findAllPublished(
    pagination: PaginationParams,
    filters?: { category?: string; tag?: string; search?: string }
  ): Promise<PaginatedResult<Blog>> {
    const conditions: string[] = ['is_published = true'];
    const params: any[] = [];
    let idx = 1;

    if (filters?.category) {
      conditions.push(`category = $${idx++}`);
      params.push(filters.category);
    }
    if (filters?.tag) {
      conditions.push(`$${idx++} = ANY(tags)`);
      params.push(filters.tag);
    }
    if (filters?.search) {
      conditions.push(
        `(title ILIKE $${idx} OR content ILIKE $${idx} OR excerpt ILIKE $${idx})`
      );
      params.push(`%${filters.search}%`);
      idx++;
    }

    const where = `WHERE ${conditions.join(' AND ')}`;
    const [rows, total] = await Promise.all([
      query<Blog>(
        `SELECT * FROM blog ${where} ORDER BY publish_date DESC, created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, pagination.limit, pagination.offset]
      ),
      this.count(conditions.join(' AND '), params),
    ]);

    return this.buildPaginatedResult(rows.rows, total, pagination);
  }

  async findAll(pagination: PaginationParams, search?: string): Promise<PaginatedResult<Blog>> {
    const params: any[] = [];
    let where = '';
    if (search) {
      where = `WHERE title ILIKE $1 OR category ILIKE $1`;
      params.push(`%${search}%`);
    }

    const [rows, total] = await Promise.all([
      query<Blog>(
        `SELECT * FROM blog ${where} ORDER BY created_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, pagination.limit, pagination.offset]
      ),
      this.count(search ? `title ILIKE $1 OR category ILIKE $1` : '', search ? [`%${search}%`] : []),
    ]);

    return this.buildPaginatedResult(rows.rows, total, pagination);
  }

  async findFeatured(): Promise<Blog[]> {
    const result = await query<Blog>(
      `SELECT * FROM blog WHERE is_featured = true AND is_published = true
       ORDER BY publish_date DESC LIMIT 3`
    );
    return result.rows;
  }

  async incrementViews(blog_id: string): Promise<void> {
    await query(
      'UPDATE blog SET views_count = views_count + 1 WHERE blog_id = $1',
      [blog_id]
    );
  }

  async getCategories(): Promise<{ category: string; count: number }[]> {
    const result = await query<{ category: string; count: string }>(
      `SELECT category, COUNT(*) as count FROM blog
       WHERE is_published = true GROUP BY category ORDER BY count DESC`
    );
    return result.rows.map((r) => ({ category: r.category, count: parseInt(r.count) }));
  }
}

export const blogRepository = new BlogRepository();
