import { HttpStatus } from '@nestjs/common';

import { AppException } from './app-exceptions';

export class InternalServerException extends AppException {
  constructor(message: string, error?: any) {
    super(
      error?.status ||
        error?.response?.status ||
        HttpStatus.INTERNAL_SERVER_ERROR,
      error?.code || error?.response?.code || 'InternalServerException',
      error?.message || error?.response?.message || message,
    );
  }
}
