import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ContextWithUserState } from '@common/interfaces';
import { StateService } from '../../module/state/services';

@Injectable()
export class StateGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly stateService: StateService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx: ContextWithUserState = context.getArgByIndex(0);
    const userId =
      ctx.update.message?.from.id.toString() ||
      ctx.update.callback_query?.from.id.toString();
    const currentState = await this.stateService.getCurrent(userId);
    const allowState = this.reflector.get<string[]>(
      'state',
      context.getHandler(),
    );

    ctx.userState = currentState?.status;
    ctx.allowState = allowState.includes(currentState?.status);
    return true;
  }
}
