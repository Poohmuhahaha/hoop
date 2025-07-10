// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://poohhoop.xyz',
  
  // Integrations
  integrations: [mdx(), sitemap()],
  
  // Performance optimizations
  build: {
    // Enable asset inlining for small files
    inlineStylesheets: 'auto',
    
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['astro'],
          'utils': ['./src/utils/index.js'],
          'performance': ['./src/utils/performance.js'],
        }
      }
    }
  },
  
  // Enable image optimization
  image: {
    // Default image formats
    formats: ['webp', 'avif'],
    
    // Image quality settings
    quality: {
      low: 50,
      medium: 80,
      high: 90,
    },
    
    // Enable responsive images
    responsive: {
      breakpoints: [480, 768, 1024, 1280, 1920],
    },
    
    // Enable image caching
    caching: true,
  },
  
  // Vite configuration for performance
  vite: {
    plugins: [tailwindcss()],
    
    // Asset optimization
    assetsInclude: ['**/*.glb', '**/*.gltf'],
    
    // Build optimizations
    build: {
      // Enable minification
      minify: 'terser',
      
      // Terser options
      terserOptions: {
        compress: {
          drop_console: true, // Remove console logs in production
          drop_debugger: true,
        },
      },
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },
    
    // Development server optimizations
    server: {
      // Enable file watching optimizations
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/.git/**'],
      },
    },
    
    // Define path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/config': path.resolve(__dirname, './src/config'),
        '@/types': path.resolve(__dirname, './src/types'),
      },
    },
    
    // Optimize dependencies
    optimizeDeps: {
      exclude: ['@astrojs/content'],
    },
  },
  
  // Experimental features removed - check Astro docs for current experimental flags
  // experimental: {
  //   // Add valid experimental features here if needed
  // },
  
  // Prefetch settings
  prefetch: {
    // Prefetch on hover
    defaultStrategy: 'hover',
    
    // Prefetch threshold
    throttle: 3,
  },
  
  // Compression settings
  compressHTML: true,
  
  // Output settings
  output: 'static', // or 'server' if you need SSR
  
  // Security headers
  security: {
    checkOrigin: true,
  },
});