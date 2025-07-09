// src/types/index.ts

export interface KnowledgeHubPost {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  heroImage?: string;
  tags?: string[];
  category?: string;
  readingTime?: number;
  author?: string;
  draft?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
  external?: boolean;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  url: string;
  image?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextUrl?: string;
  prevUrl?: string;
}

export interface TableOfContentsItem {
  text: string;
  slug: string;
  depth: number;
}

export interface PostMetadata {
  readingTime: number;
  wordCount: number;
  tableOfContents: TableOfContentsItem[];
}