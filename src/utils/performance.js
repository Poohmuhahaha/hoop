// src/utils/performance.js

/**
 * Performance monitoring utilities
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.init();
  }
  
  init() {
    // Web Vitals monitoring
    this.initWebVitals();
    
    // Resource timing
    this.initResourceTiming();
    
    // Navigation timing
    this.initNavigationTiming();
  }
  
  initWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);
    }
    
    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);
    }
    
    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('CLS', clsValue);
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    }
  }
  
  initResourceTiming() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordResourceTiming(entry);
        });
      });
      
      resourceObserver.observe({ type: 'resource', buffered: true });
      this.observers.push(resourceObserver);
    }
  }
  
  initNavigationTiming() {
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordNavigationTiming(entry);
        });
      });
      
      navigationObserver.observe({ type: 'navigation', buffered: true });
      this.observers.push(navigationObserver);
    }
  }
  
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name).push({
      value,
      timestamp: Date.now(),
      url: window.location.href
    });
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`📊 ${name}: ${value.toFixed(2)}ms`);
    }
  }
  
  recordResourceTiming(entry) {
    const duration = entry.responseEnd - entry.startTime;
    const type = this.getResourceType(entry.name);
    
    this.recordMetric(`Resource-${type}`, duration);
    
    // Track slow resources
    if (duration > 1000) {
      console.warn(`🐌 Slow resource: ${entry.name} (${duration.toFixed(2)}ms)`);
    }
  }
  
  recordNavigationTiming(entry) {
    const metrics = {
      'DNS-Lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'TCP-Connection': entry.connectEnd - entry.connectStart,
      'Request-Response': entry.responseEnd - entry.requestStart,
      'DOM-Processing': entry.domContentLoadedEventEnd - entry.responseEnd,
      'Page-Load': entry.loadEventEnd - entry.navigationStart
    };
    
    Object.entries(metrics).forEach(([name, value]) => {
      if (value > 0) {
        this.recordMetric(name, value);
      }
    });
  }
  
  getResourceType(url) {
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'Image';
    if (url.match(/\.(css)$/i)) return 'CSS';
    if (url.match(/\.(js)$/i)) return 'JS';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'Font';
    return 'Other';
  }
  
  getMetrics() {
    const result = {};
    
    this.metrics.forEach((values, name) => {
      const recent = values.slice(-10); // Last 10 measurements
      result[name] = {
        current: recent[recent.length - 1]?.value || 0,
        average: recent.reduce((sum, m) => sum + m.value, 0) / recent.length,
        count: values.length
      };
    });
    
    return result;
  }
  
  getPerformanceScore() {
    const metrics = this.getMetrics();
    let score = 100;
    
    // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
    if (metrics.LCP) {
      const lcp = metrics.LCP.current;
      if (lcp > 4000) score -= 30;
      else if (lcp > 2500) score -= 15;
    }
    
    // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
    if (metrics.FID) {
      const fid = metrics.FID.current;
      if (fid > 300) score -= 25;
      else if (fid > 100) score -= 10;
    }
    
    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (metrics.CLS) {
      const cls = metrics.CLS.current;
      if (cls > 0.25) score -= 20;
      else if (cls > 0.1) score -= 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  exportReport() {
    return {
      timestamp: Date.now(),
      url: window.location.href,
      metrics: this.getMetrics(),
      score: this.getPerformanceScore(),
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
  }
  
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Performance timing decorator
 * @param {string} name - Operation name
 * @param {Function} fn - Function to time
 * @returns {Function} Wrapped function
 */
export function withTiming(name, fn) {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      performanceMonitor.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      performanceMonitor.recordMetric(`${name}-Error`, duration);
      throw error;
    }
  };
}

/**
 * Mark important user interactions
 * @param {string} action - Action name
 */
export function markUserAction(action) {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(`user-action-${action}`);
  }
  
  performanceMonitor.recordMetric(`User-${action}`, 0);
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  // Report performance metrics every 30 seconds
  setInterval(() => {
    const report = performanceMonitor.exportReport();
    
    // In production, you'd send this to your analytics service
    if (import.meta.env.DEV) {
      console.log('📊 Performance Report:', report);
    }
  }, 30000);
  
  // Report on page unload
  window.addEventListener('beforeunload', () => {
    const report = performanceMonitor.exportReport();
    
    // Send final report (beacon API for reliability)
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon('/api/performance', JSON.stringify(report));
    }
  });
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
}