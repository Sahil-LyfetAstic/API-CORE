import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private _cache: Cache) {}

  async addToBlackList({
    sessionId,
    expireAt,
    token,
  }: {
    sessionId: string;
    expireAt: number;
    token: string;
  }): Promise<void> {
    const key = `BL_${sessionId}`;
    token = token.replace('Bearer ', '');
    let value = (await this.getList<string[]>({ key })) || [];
    value = [...value, token];
    await this.addToList({ key, value, expireAt: expireAt });
  }

  async isBlackListed({ sessionId, token }) {
    const key = `BL_${sessionId}`;
    const value = await this.getList<string[]>({ key });
    token = token.replace('Bearer ', '');
    if (value && Array.isArray(value) && value.indexOf(token) > -1) {
      return true;
    }
    return false;
  }

  async addToList({
    key,
    value,
    expireAt = undefined,
  }: {
    key: string;
    value: unknown;
    expireAt?: number;
  }): Promise<void> {
    await this._cache.set(key, value, expireAt);
  }

  async getList<T>({ key }): Promise<T> {
    return await this._cache.get(key);
  }

  async clearCache(): Promise<void> {
    await this._cache.reset();
  }
}
