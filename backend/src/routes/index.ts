/**
 * Route Index
 * Registers all module routes onto the Express app under /api/v1
 */

import { Express } from 'express';
import authRoutes from './auth.routes';
import serviceRoutes from './service.routes';
import portfolioRoutes from './portfolio.routes';
import blogRoutes from './blog.routes';
import testimonialRoutes from './testimonial.routes';
import developerRoutes from './developer.routes';
import messageRoutes from './message.routes';
import chatRoutes from './chat.routes';
import dashboardRoutes from './dashboard.routes';

export function registerRoutes(app: Express, prefix: string = '/api/v1'): void {
  app.use(prefix, authRoutes);
  app.use(prefix, serviceRoutes);
  app.use(prefix, portfolioRoutes);
  app.use(prefix, blogRoutes);
  app.use(prefix, testimonialRoutes);
  app.use(prefix, developerRoutes);
  app.use(prefix, messageRoutes);
  app.use(prefix, chatRoutes);
  app.use(prefix, dashboardRoutes);
}
