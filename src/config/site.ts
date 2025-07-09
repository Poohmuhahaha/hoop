// src/config/site.ts

import type { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  title: 'Hoop - Personal Portfolio',
  description: 'Personal portfolio website with Knowledge Hub and CV',
  author: 'Your Name',
  url: 'https://yourwebsite.com', // เปลี่ยนเป็น URL จริงของคุณ
  image: '/images/og-image.jpg',
  social: {
    github: 'https://github.com/Poohmuhahaha',
    linkedin: 'https://linkedin.com/in/yourprofile',
    twitter: 'https://twitter.com/yourhandle',
    email: 'your.email@example.com',
  },
};

export const navigationItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'CV',
    href: '/cv',
  },
  {
    label: 'Knowledge Hub',
    href: '/knowledgehub',
  },
];

export const knowledgeHubConfig = {
  postsPerPage: 10,
  showReadingTime: true,
  showTableOfContents: true,
  enableSearch: true,
  enableTags: true,
  enableCategories: true,
};