import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TelegrafUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const args = context.getArgByIndex(0);
    return args.update.message.from.id.toString();
  },
);
