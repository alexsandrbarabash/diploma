import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: Error, context: ArgumentsHost): void {
    const ctx = context.getArgByIndex(0);
    console.log('ctx', ctx);
  }
}
