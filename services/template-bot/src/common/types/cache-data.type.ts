import { UserStatus } from '../enums';

type WaitingData = {
  status: UserStatus.WAITING_DATA;
};

type WaitingFileForSaveData = {
  status: UserStatus.WAITING_FILE_FOR_SAVE;
};

type WaitingFileForDeleteData = {
  status: UserStatus.WAITING_FILE_FOR_DELETE;
};

type WaitingTempalte = {
  status: UserStatus.WAITING_TEMPLATE;
  fields: { fileId: string; userId: string; fileName: string };
};

type WaitingFile = {
  status: UserStatus.WAITING_FILE;
  fields: { type: 'template' | 'data' };
};

export type CacheData =
  | WaitingData
  | WaitingFile
  | WaitingTempalte
  | WaitingFileForSaveData
  | WaitingFileForDeleteData;
