// src/utils/cache.js

/**
 * Simple in-memory cache for static content
 */
class MemoryCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  has(key) {
    return this.get(key) !== null;
  }
  
  delete(key) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
}

// Global cache instances
export const postCache = new MemoryCache(10 * 60 * 1000); // 10 minutes for posts
export const assetCache = new MemoryCache(30 * 60 * 1000); // 30 minutes for assets

/**
 * Cache wrapper for async functions
 * @param {string} key - Cache key
 * @param {Function} fn - Function to cache
 * @param {MemoryCache} cache - Cache instance
 * @returns {Promise<any>} Cached or fresh result
 */
export async function withCache(key, fn, cache = postCache) {
  const cached = cache.get(key);
  if (cached) return cached;
  
  const result = await fn();
  cache.set(key, result);
  return result;
}

/**
 * Preload and cache critical content
 * @param {Array} posts - Posts to preload
 */
export function preloadCriticalContent(posts) {
  // Cache recent posts
  const recentPosts = posts.slice(0, 5);
  recentPosts.forEach(post => {
    postCache.set(`post-${post.slug}`, post);
  });
  
  // Cache post list
  postCache.set('all-posts', posts);
  
  console.log(`Preloaded ${recentPosts.length} posts to cache`);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    posts: postCache.size(),
    assets: assetCache.size(),
    memory: process.memoryUsage ? process.memoryUsage() : null
  };
}

/**
 * Cache invalidation for specific patterns
 * @param {string} pattern - Pattern to match keys
 */
export function invalidateCache(pattern) {
  const regex = new RegExp(pattern);
  
  // Clear matching keys from post cache
  for (const [key] of postCache.cache) {
    if (regex.test(key)) {
      postCache.delete(key);
    }
  }
  
  // Clear matching keys from asset cache
  for (const [key] of assetCache.cache) {
    if (regex.test(key)) {
      assetCache.delete(key);
    }
  }
}

/**
 * Warmup cache with popular content
 * @param {Array} popularSlugs - Array of popular post slugs
 */
export async function warmupCache(popularSlugs) {
  const warmupPromises = popularSlugs.map(async (slug) => {
    try {
      // This would typically fetch from your content source
      // For now, we'll just mark these as "warmed up"
      postCache.set(`warmup-${slug}`, { warmed: true, timestamp: Date.now() });
    } catch (error) {
      console.error(`Failed to warmup cache for ${slug}:`, error);
    }
  });
  
  await Promise.all(warmupPromises);
  console.log(`Warmed up cache for ${popularSlugs.length} popular posts`);
}