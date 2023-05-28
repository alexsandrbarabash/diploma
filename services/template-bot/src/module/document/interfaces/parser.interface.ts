export type Row = Record<string, string | number>;

export interface IParser {
  parse(input: Buffer): Row[] | Promise<Row[]>;
}
