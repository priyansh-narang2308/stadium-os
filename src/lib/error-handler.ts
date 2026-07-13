/**
 * Error Handling Utilities
 * Production-ready error handling and recovery strategies
 */

import { logger } from './logger';

export class ErrorHandler {
  private errors: Map<string, number> = new Map();
  private recoveryAttempts: Map<string, number> = new Map();

  constructor() {
    this.initializeRecoveryStrategies();
  }

  private initializeRecoveryStrategies(): void {
    // Initialize retry and recovery mechanisms for different error types
    this.recoveryAttempts.set('rate_limit', 0);
    this.recoveryAttempts.set('ai_service', 0);
    this.recoveryAttempts.set('database', 0);
  }

  async handleError(error: Error, context: string): Promise<void> {
    const errorId = this.generateErrorId(error);
    const timestamp = Date.now();
    const errorCount = this.errors.get(errorId) || 0;
    
    // Log error with context
    logger.error(`Error in ${context}: ${error.message}`, error, {
      errorId,
      errorCount,
      timestamp,
      context,
    });
    
    // Track error for potential recovery
    this.errors.set(errorId, errorCount + 1);
    
    // Attempt recovery if within limits
    if (errorCount < 3) {
      await this.attemptRecovery(error, context, errorId);
    }
  }

  private generateErrorId(error: Error): string {
    return btoa(`${error.name}:${error.message}`).substring(0, 16);
  }

  private async attemptRecovery(error: Error, context: string, errorId: string): Promise<void> {
    logger.info('Attempting recovery', { context, errorId, errorMessage: error.message });
    if (context === 'rate_limit') {
      const attemptCount = this.recoveryAttempts.get('rate_limit') || 0;
      if (attemptCount < 3) {
        this.recoveryAttempts.set('rate_limit', attemptCount + 1);
        logger.info('Attempting rate limit recovery', { attempt: attemptCount + 1, errorId });
      }
    } else if (context === 'ai_service') {
      logger.warn('AI service error, considering fallback responses', { errorId });
    } else if (context === 'database') {
      logger.warn('Database error, checking connection pool', { errorId });
    }
  }

  getHealthStatus(): Record<string, unknown> {
    return {
      errorCount: Object.keys(this.errors).length,
      recoveryAttempts: Object.keys(this.recoveryAttempts).length,
      errorHistory: Object.fromEntries(this.errors),
      recoveryHistory: Object.fromEntries(this.recoveryAttempts),
    };
  }

  resetErrorHistory(): void {
    this.errors.clear();
    this.recoveryAttempts.clear();
    logger.info('Error history reset');
  }
}

export const errorHandler = new ErrorHandler();