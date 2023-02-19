import { UserStatus } from '../enums';

type WaitingDataCache = {
  status: UserStatus.WAITING_TEMPLATE;
  fields: { fileId: string; userId: string; fileName: string };
};

export type CacheData = WaitingDataCache;
