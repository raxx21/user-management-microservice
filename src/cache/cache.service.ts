import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private cache: Record<string, any> = {};

  set(key: string, value: any, ttlInSeconds: number = 300): void {
    this.cache[key] = { value, expiry: Date.now() + ttlInSeconds * 1000 };
  }

  get<T>(key: string): T | undefined {
    const cachedData = this.cache[key];
    if (cachedData && cachedData.expiry > Date.now()) {
      return cachedData.value as T;
    }
    return undefined;
  }

  delete(key: string): void {
    delete this.cache[key];
  }
}
