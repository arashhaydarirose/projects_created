interface CacheItem {
  value: string;
  timestamp: number;
}

class ResponseCache {
  private cache: Map<string, CacheItem>;
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number = 100, ttl: number = 3600000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key: string, value: string): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const responseCache = new ResponseCache();