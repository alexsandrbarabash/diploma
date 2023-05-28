import { Injectable } from '@nestjs/common';
import xml2js from 'xml2js';

import { IParser, Row } from '../interfaces';

type XmlRow = Record<string, [string | number]>;

@Injectable()
export class XmlParser implements IParser {
  private toFormatRow(xmlRow: XmlRow): Row {
    const row: Row = {};

    for (const item in xmlRow) {
      row[item] = xmlRow[item][0];
    }

    return row;
  }

  async parse(input: Buffer): Promise<Row[]> {
    const xmlString = input.toString('utf8');

    const parser = new xml2js.Parser();

    const result = await parser.parseStringPromise(xmlString);

    if (!result?.data?.row) {
      return [];
    }

    return result.data.row.map((item) => {
      return this.toFormatRow(item);
    });
  }
}
