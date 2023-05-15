export class FileExceptionsUtils {
  static get(name: string): string {
    return name.split('.').pop();
  }
}
