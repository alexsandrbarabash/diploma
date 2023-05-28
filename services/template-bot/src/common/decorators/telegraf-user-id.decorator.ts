import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Context } from '../interfaces';

export const TelegrafUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const args: Context = context.getArgByIndex(0);
    return (
      args.update.message?.from.id.toString() ||
      args.update.callback_query?.from.id.toString()
    );
  },
);
