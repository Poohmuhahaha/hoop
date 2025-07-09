// src/utils/errors.ts

export class PostNotFoundError extends Error {
  constructor(slug: string) {
    super(`Post with slug "${slug}" not found`);
    this.name = 'PostNotFoundError';
  }
}

export class InvalidDateError extends Error {
  constructor(date: string) {
    super(`Invalid date format: ${date}`);
    this.name = 'InvalidDateError';
  }
}

export class ContentLoadError extends Error {
  constructor(message: string) {
    super(`Failed to load content: ${message}`);
    this.name = 'ContentLoadError';
  }
}

/**
 * Safe async function wrapper with error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('Error in safeAsync:', error);
    return fallback;
  }
}

/**
 * Validate post data
 */
export function validatePost(post: any): boolean {
  if (!post) return false;
  if (!post.title || typeof post.title !== 'string') return false;
  if (!post.description || typeof post.description !== 'string') return false;
  if (!post.pubDate || !(post.pubDate instanceof Date)) return false;
  
  return true;
}

/**
 * Handle async errors in Astro pages
 */
export function handlePageError(error: unknown, context: string): never {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof PostNotFoundError) {
    throw new Response('Post not found', { status: 404 });
  }
  
  if (error instanceof ContentLoadError) {
    throw new Response('Failed to load content', { status: 500 });
  }
  
  throw new Response('Internal server error', { status: 500 });
}