/**
 * Service Module — Business Logic
 */

import { serviceRepository } from '../repositories/service.repository';
import { NotFoundError } from '../utils/errors';
import { Service, CreateServiceDTO, UpdateServiceDTO, PaginationParams, PaginatedResult } from '../types';

export class ServiceService {
  async create(admin_id: string, dto: CreateServiceDTO): Promise<Service> {
    return serviceRepository.create(admin_id, dto);
  }

  async update(service_id: string, dto: UpdateServiceDTO): Promise<Service> {
    const service = await serviceRepository.update(service_id, dto);
    if (!service) throw new NotFoundError('Service');
    return service;
  }

  async delete(service_id: string): Promise<void> {
    const deleted = await serviceRepository.delete(service_id);
    if (!deleted) throw new NotFoundError('Service');
  }

  async getById(service_id: string): Promise<Service> {
    const service = await serviceRepository.findById(service_id);
    if (!service) throw new NotFoundError('Service');
    return service;
  }

  async getAll(pagination: PaginationParams, search?: string): Promise<PaginatedResult<Service>> {
    return serviceRepository.findAll(pagination, search);
  }

  async getAllActive(): Promise<Service[]> {
    return serviceRepository.findAllActive();
  }
}

export const serviceService = new ServiceService();
