import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { StateGuard } from '../guards';

export function State(...state: string[]) {
  return applyDecorators(SetMetadata('state', state), UseGuards(StateGuard));
}
