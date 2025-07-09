// src/utils/index.ts

import type { KnowledgeHubPost, TableOfContentsItem } from '../types';

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Calculate reading time based on word count
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get word count from content
 */
export function getWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate(posts: KnowledgeHubPost[]): KnowledgeHubPost[] {
  return posts.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

/**
 * Filter published posts only
 */
export function filterPublishedPosts(posts: KnowledgeHubPost[]): KnowledgeHubPost[] {
  return posts.filter(post => !post.draft);
}

/**
 * Get posts by category
 */
export function getPostsByCategory(posts: KnowledgeHubPost[], category: string): KnowledgeHubPost[] {
  return posts.filter(post => post.category === category);
}

/**
 * Get posts by tag
 */
export function getPostsByTag(posts: KnowledgeHubPost[], tag: string): KnowledgeHubPost[] {
  return posts.filter(post => post.tags?.includes(tag));
}

/**
 * Get unique categories from posts
 */
export function getUniqueCategories(posts: KnowledgeHubPost[]): string[] {
  const categories = posts
    .map(post => post.category)
    .filter((category): category is string => category !== undefined);
  return [...new Set(categories)];
}

/**
 * Get unique tags from posts
 */
export function getUniqueTags(posts: KnowledgeHubPost[]): string[] {
  const tags = posts
    .flatMap(post => post.tags || [])
    .filter(tag => tag !== undefined);
  return [...new Set(tags)];
}

/**
 * Generate table of contents from markdown content
 */
export function generateTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length;
    const text = match[2];
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    toc.push({
      text,
      slug,
      depth,
    });
  }

  return toc;
}

/**
 * Create slug from title
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'วันนี้';
  if (days === 1) return 'เมื่อวาน';
  if (days < 7) return `${days} วันที่แล้ว`;
  if (days < 30) return `${Math.floor(days / 7)} สัปดาห์ที่แล้ว`;
  if (days < 365) return `${Math.floor(days / 30)} เดือนที่แล้ว`;
  return `${Math.floor(days / 365)} ปีที่แล้ว`;
}