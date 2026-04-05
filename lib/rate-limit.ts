interface RateLimiterOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private cache: Map<string, RateLimitInfo>;
  private limit: number;
  private windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.cache = new Map();
    this.limit = options.limit;
    this.windowMs = options.windowMs;
  }

  public check(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now();
    const hit = this.cache.get(ip);

    // Clean up expired entries occasionally to avoid memory leaks
    if (this.cache.size > 5000) {
      this.cleanup(now);
    }

    if (!hit) {
      this.cache.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return { success: true, limit: this.limit, remaining: this.limit - 1, reset: now + this.windowMs };
    }

    if (now > hit.resetTime) {
      this.cache.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return { success: true, limit: this.limit, remaining: this.limit - 1, reset: now + this.windowMs };
    }

    if (hit.count >= this.limit) {
      return { success: false, limit: this.limit, remaining: 0, reset: hit.resetTime };
    }

    hit.count += 1;
    this.cache.set(ip, hit);
    return { success: true, limit: this.limit, remaining: this.limit - hit.count, reset: hit.resetTime };
  }

  private cleanup(now: number) {
    for (const [key, value] of this.cache.entries()) {
      if (now > value.resetTime) {
        this.cache.delete(key);
      }
    }
  }
}
