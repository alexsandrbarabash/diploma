import format from 'string-template';

export class FileNameUtils {
  static get(
    name: string,
    data: Record<string, string | number | boolean>,
  ): string {
    if (!name.includes('{') || !name.includes('}')) {
      return `${Date.now}-${name}`;
    }

    return format(name, data);
  }
}
