import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { AppConfig } from '@config';
import { GetFileDataResponse } from './types';

@Injectable()
export class TelegramApiService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  private async stream2buffer(stream: NodeJS.ReadStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const _buf = Array<any>();

      stream.on('data', (chunk) => _buf.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(_buf)));
      stream.on('error', (err) => reject(`error converting stream - ${err}`));
    });
  }

  async getFile(fileId: string): Promise<Buffer> {
    const getFileResponse = await axios.get(
      `https://api.telegram.org/bot${this.configService.get<GetFileDataResponse>(
        'BOT_TOKEN',
      )}/getFile?file_id=${fileId}`,
    );

    const filePath = getFileResponse.data.result?.file_path;

    const response = await axios.get<NodeJS.ReadStream>(
      `https://api.telegram.org/file/bot${this.configService.get(
        'BOT_TOKEN',
      )}/${filePath}`,
      { responseType: 'stream' },
    );

    return this.stream2buffer(response.data);
  }
}
