import { Redis } from 'ioredis';

export class RedisMap {
  constructor(private readonly name: string, private readonly client: Redis) {}

  private addAlias(key: string): string {
    return `${this.name}:${key}`;
  }

  private removeAlias(key: string): string {
    return key.replace(`${this.name}:`, '');
  }

  private getAll(): Promise<string[]> {
    return this.client.keys(`${this.name}:*`);
  }

  get(key: string): Promise<string | null> {
    return this.client.get(this.addAlias(key));
  }

  async set(key: string, value: string, expired?: number): Promise<void> {
    const fullKey = this.addAlias(key);

    await this.client.set(fullKey, value);
    if (expired) {
      await this.client.expire(fullKey, expired);
    }
  }

  async has(key: string): Promise<boolean> {
    return Boolean(await this.client.exists(this.addAlias(key)));
  }

  async clear(): Promise<void> {
    await this.client.unlink(`${this.name}:*`);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(this.addAlias(key));
  }

  async *[Symbol.asyncIterator]() {
    const data = await this.getAll();
    for await (const item of data) {
      const key = this.removeAlias(item);
      const value = await this.get(key);
      yield [key, value];
    }
  }
}
