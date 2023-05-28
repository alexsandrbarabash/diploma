import { Injectable } from '@nestjs/common';
import xml2js from 'xml2js';

import { IParser, Row } from '../interfaces';

@Injectable()
export class XmlParser implements IParser {
  async parse(input: Buffer): Promise<Row[]> {
    const xmlString = input.toString('utf8');

    const parser = new xml2js.Parser();

    const result = await parser.parseString(xmlString);

    console.log('result', result);
    return [];

    // return arr as Row[];
  }
}
