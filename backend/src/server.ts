/**
 * Server Entry Point
 * Starts the Express server, connects to the database, and handles graceful shutdown.
 */

import { createApp } from './app';
import { testConnection, closePool } from './config/database';
import config from './config/environment';
import logger from './utils/logger';

const app = createApp();

// =====================================================
// START SERVER
// =====================================================
async function startServer(): Promise<void> {
  try {
    // 1. Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      if (config.server.isProduction) {
        logger.error('❌ Cannot connect to database. Exiting...');
        process.exit(1);
      } else {
        logger.warn('⚠️  Database not connected. Server starting anyway for development.');
        logger.warn('   → Fill in DATABASE_URL in backend/.env.local with your Supabase URI');
      }
    }

    // 2. Start listening
    const server = app.listen(config.server.port, () => {
      logger.info(`🚀 Server running`, {
        port: config.server.port,
        env: config.server.nodeEnv,
        api: `http://localhost:${config.server.port}/api/${config.server.apiVersion}`,
        health: `http://localhost:${config.server.port}/health`,
      });
    });

    // ===================================================
    // GRACEFUL SHUTDOWN
    // ===================================================
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await closePool();
        logger.info('Database pool closed');
        process.exit(0);
      });

      // Force shutdown after 10s if graceful fails
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled rejection', { reason });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: (error as Error).message });
    process.exit(1);
  }
}

startServer();
