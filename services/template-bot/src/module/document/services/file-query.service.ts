import { Injectable } from '@nestjs/common';
import { Tempalte, Data } from '@prisma/client';

import { PrismaService } from '@infrastructure/prisma';

@Injectable()
export class FileQuery {
  constructor(public readonly prisma: PrismaService) {}

  public async getTemplates(chatId: string): Promise<Tempalte[]> {
    return this.prisma.tempalte.findMany({ where: { user: { chatId } } });
  }

  public async getData(chatId: string): Promise<Data[]> {
    return this.prisma.data.findMany({ where: { user: { chatId } } });
  }

  public getTemplateById(id: string): Promise<Tempalte> {
    return this.prisma.tempalte.findUnique({ where: { id } });
  }

  public getDataById(id: string): Promise<Data> {
    return this.prisma.data.findUnique({ where: { id } });
  }
}
