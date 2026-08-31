/**
 * Blog Service — Business Logic
 */

import { blogRepository } from '../repositories/blog.repository';
import { NotFoundError, ConflictError } from '../utils/errors';
import { Blog, CreateBlogDTO, UpdateBlogDTO, PaginationParams, PaginatedResult } from '../types';
import { generateSlug, generateUniqueSlug, calculateReadTime } from '../utils/helpers';

export class BlogService {
  async create(admin_id: string, dto: CreateBlogDTO): Promise<Blog> {
    // Auto-generate slug if not provided
    let slug = dto.slug ?? generateSlug(dto.title);

    // Ensure slug uniqueness
    if (await blogRepository.slugExists(slug)) {
      slug = generateUniqueSlug(slug, Date.now());
    }

    // Auto-calculate reading time if not provided
    const read_time_minutes = dto.read_time_minutes ?? calculateReadTime(dto.content);

    return blogRepository.create(admin_id, { ...dto, slug, read_time_minutes });
  }

  async update(blog_id: string, dto: UpdateBlogDTO): Promise<Blog> {
    const existing = await blogRepository.findById(blog_id);
    if (!existing) throw new NotFoundError('Blog post');

    // Validate slug uniqueness on update
    if (dto.slug && dto.slug !== existing.slug) {
      if (await blogRepository.slugExists(dto.slug, blog_id)) {
        throw new ConflictError('Slug already in use by another post');
      }
    }

    // Recalculate read time if content changed
    if (dto.content && !dto.read_time_minutes) {
      dto.read_time_minutes = calculateReadTime(dto.content);
    }

    const blog = await blogRepository.update(blog_id, dto);
    if (!blog) throw new NotFoundError('Blog post');
    return blog;
  }

  async publish(blog_id: string): Promise<Blog> {
    const blog = await blogRepository.update(blog_id, {
      is_published: true,
      publish_date: new Date().toISOString(),
    });
    if (!blog) throw new NotFoundError('Blog post');
    return blog;
  }

  async unpublish(blog_id: string): Promise<Blog> {
    const blog = await blogRepository.update(blog_id, { is_published: false });
    if (!blog) throw new NotFoundError('Blog post');
    return blog;
  }

  async delete(blog_id: string): Promise<void> {
    const deleted = await blogRepository.delete(blog_id);
    if (!deleted) throw new NotFoundError('Blog post');
  }

  async getById(blog_id: string): Promise<Blog> {
    const blog = await blogRepository.findById(blog_id);
    if (!blog) throw new NotFoundError('Blog post');
    return blog;
  }

  async getBySlug(slug: string): Promise<Blog> {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) throw new NotFoundError('Blog post');
    blogRepository.incrementViews(blog.blog_id).catch(() => {});
    return blog;
  }

  async getAll(pagination: PaginationParams, search?: string): Promise<PaginatedResult<Blog>> {
    return blogRepository.findAll(pagination, search);
  }

  async getPublished(
    pagination: PaginationParams,
    filters?: { category?: string; tag?: string; search?: string }
  ): Promise<PaginatedResult<Blog>> {
    return blogRepository.findAllPublished(pagination, filters);
  }

  async getFeatured(): Promise<Blog[]> {
    return blogRepository.findFeatured();
  }

  async getCategories(): Promise<{ category: string; count: number }[]> {
    return blogRepository.getCategories();
  }
}

export const blogService = new BlogService();
