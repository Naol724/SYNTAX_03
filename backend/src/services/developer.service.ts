/**
 * Developer Service — Business Logic
 */

import { developerRepository } from '../repositories/developer.repository';
import { NotFoundError } from '../utils/errors';
import { Developer, CreateDeveloperDTO, UpdateDeveloperDTO, PaginationParams, PaginatedResult } from '../types';

export class DeveloperService {
  async create(admin_id: string, dto: CreateDeveloperDTO): Promise<Developer> {
    return developerRepository.create(admin_id, dto);
  }

  async update(developer_id: string, dto: UpdateDeveloperDTO): Promise<Developer> {
    const dev = await developerRepository.update(developer_id, dto);
    if (!dev) throw new NotFoundError('Developer');
    return dev;
  }

  async delete(developer_id: string): Promise<void> {
    const deleted = await developerRepository.delete(developer_id);
    if (!deleted) throw new NotFoundError('Developer');
  }

  async getById(developer_id: string): Promise<Developer> {
    const dev = await developerRepository.findById(developer_id);
    if (!dev) throw new NotFoundError('Developer');
    return dev;
  }

  async getAll(pagination: PaginationParams, search?: string): Promise<PaginatedResult<Developer>> {
    return developerRepository.findAll(pagination, search);
  }

  async getAllActive(): Promise<Developer[]> {
    return developerRepository.findAllActive();
  }
}

export const developerService = new DeveloperService();
