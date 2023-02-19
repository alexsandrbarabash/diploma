import { parse, Options } from 'csv-parse/sync';

export interface LineWithOriginalLine<LineType> {
  record: LineType;
  raw?: string;
}

export class CsvParser<LineType = any> {
  private _removeEmptyColumn(line: LineType): any {
    const newObj = {};

    Object.keys(line).forEach((key) => {
      if (line[key]) {
        newObj[key] = line[key];
      }
    });

    return newObj;
  }

  private _convectorToBooleanColumns(line: LineType): any {
    const trueStrings = ['TRUE', 'true'];
    const falseStrings = ['FALSE', 'false'];

    const newObj = {};

    Object.keys(line).forEach((key) => {
      if (trueStrings.includes(line[key])) {
        newObj[key] = true;
        return;
      }

      if (falseStrings.includes(line[key])) {
        newObj[key] = false;
        return;
      }

      newObj[key] = line[key];
    });

    return newObj;
  }

  public parse({
    input,
    removeEmptyColumn = true,
    getOriginalRaw = false,
    convectorToBoolean = false,
    options,
  }: {
    input: Buffer | string;
    removeEmptyColumn?: boolean;
    getOriginalRaw?: boolean;
    convectorToBoolean?: boolean;
    options?: Omit<Options, 'raw'>;
  }): LineWithOriginalLine<LineType>[] {
    const parserOption = !options
      ? {
          skipEmptyLines: true,
          trim: true,
          columns: true,
          delimiter: ',',
        }
      : options;

    const data = parse(input, { ...parserOption, raw: getOriginalRaw });
    return data.map((line: LineWithOriginalLine<LineType>) => {
      let record = (getOriginalRaw ? line?.record : line) as LineType;

      if (convectorToBoolean) {
        record = this._convectorToBooleanColumns(record);
      }

      if (removeEmptyColumn) {
        record = this._removeEmptyColumn(record);
      }
      return { record, raw: line.raw };
    });
  }
}
