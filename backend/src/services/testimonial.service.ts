/**
 * Testimonial Service — Business Logic
 */

import { testimonialRepository } from '../repositories/testimonial.repository';
import { NotFoundError } from '../utils/errors';
import { Testimonial, CreateTestimonialDTO, UpdateTestimonialDTO, PaginationParams, PaginatedResult } from '../types';

export class TestimonialService {
  async create(admin_id: string, dto: CreateTestimonialDTO): Promise<Testimonial> {
    return testimonialRepository.create(admin_id, dto);
  }

  async update(testimonial_id: string, dto: UpdateTestimonialDTO): Promise<Testimonial> {
    const t = await testimonialRepository.update(testimonial_id, dto);
    if (!t) throw new NotFoundError('Testimonial');
    return t;
  }

  async approve(testimonial_id: string): Promise<Testimonial> {
    const t = await testimonialRepository.update(testimonial_id, { is_approved: true });
    if (!t) throw new NotFoundError('Testimonial');
    return t;
  }

  async delete(testimonial_id: string): Promise<void> {
    const deleted = await testimonialRepository.delete(testimonial_id);
    if (!deleted) throw new NotFoundError('Testimonial');
  }

  async getById(testimonial_id: string): Promise<Testimonial> {
    const t = await testimonialRepository.findById(testimonial_id);
    if (!t) throw new NotFoundError('Testimonial');
    return t;
  }

  async getAll(pagination: PaginationParams): Promise<PaginatedResult<Testimonial>> {
    return testimonialRepository.findAll(pagination);
  }

  async getApproved(pagination: PaginationParams): Promise<PaginatedResult<Testimonial>> {
    return testimonialRepository.findApproved(pagination);
  }

  async getFeatured(): Promise<Testimonial[]> {
    return testimonialRepository.findFeatured();
  }
}

export const testimonialService = new TestimonialService();
