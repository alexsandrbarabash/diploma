import { HttpStatus } from '@nestjs/common';
import { AppException } from './app-exceptions';

export class RedisExceptions extends AppException {
  constructor(message: string, error?: any) {
    super(
      error?.status ||
        error?.response?.status ||
        HttpStatus.INTERNAL_SERVER_ERROR,
      error?.code || error?.response?.code || 'RedisExceptions',
      error?.message || error?.response?.message || message,
    );
  }
}
