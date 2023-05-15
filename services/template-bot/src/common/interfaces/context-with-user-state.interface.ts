import { Context } from './context.interface';
import { UserStatus } from '../enums';

export interface ContextWithUserState extends Context {
  userState: UserStatus;
  allowState: boolean;
}
