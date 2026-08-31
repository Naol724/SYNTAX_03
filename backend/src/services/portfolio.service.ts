/**
 * Portfolio Service — Business Logic
 */

import { portfolioRepository } from '../repositories/portfolio.repository';
import { NotFoundError } from '../utils/errors';
import { Portfolio, CreatePortfolioDTO, UpdatePortfolioDTO, PaginationParams, PaginatedResult } from '../types';

export class PortfolioService {
  async create(admin_id: string, dto: CreatePortfolioDTO): Promise<Portfolio> {
    return portfolioRepository.create(admin_id, dto);
  }

  async update(portfolio_id: string, dto: UpdatePortfolioDTO): Promise<Portfolio> {
    const portfolio = await portfolioRepository.update(portfolio_id, dto);
    if (!portfolio) throw new NotFoundError('Portfolio');
    return portfolio;
  }

  async delete(portfolio_id: string): Promise<void> {
    const deleted = await portfolioRepository.delete(portfolio_id);
    if (!deleted) throw new NotFoundError('Portfolio');
  }

  async getById(portfolio_id: string): Promise<Portfolio> {
    const portfolio = await portfolioRepository.findById(portfolio_id);
    if (!portfolio) throw new NotFoundError('Portfolio');
    // Fire-and-forget view increment
    portfolioRepository.incrementViews(portfolio_id).catch(() => {});
    return portfolio;
  }

  async getAll(pagination: PaginationParams, search?: string): Promise<PaginatedResult<Portfolio>> {
    return portfolioRepository.findAll(pagination, search);
  }

  async getPublished(
    pagination: PaginationParams,
    filters?: { type?: string; language?: string }
  ): Promise<PaginatedResult<Portfolio>> {
    return portfolioRepository.findAllPublished(pagination, filters);
  }

  async getFeatured(): Promise<Portfolio[]> {
    return portfolioRepository.findFeatured();
  }
}

export const portfolioService = new PortfolioService();
