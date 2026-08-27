import { Product, SearchApiResponse } from '../types';
import { INITIAL_PRODUCTS } from './productsData';

// Global config for debug/testing
export const mockApiConfig = {
  minLatencyMs: 200,
  maxLatencyMs: 1200,
  simulateNetworkErrors: false,
};

function getRandomDelay(): number {
  return Math.floor(
    Math.random() * (mockApiConfig.maxLatencyMs - mockApiConfig.minLatencyMs + 1) + mockApiConfig.minLatencyMs
  );
}

export async function fetchProducts(
  categoryId?: string,
  signal?: AbortSignal,
  forcedDelayMs?: number
): Promise<Product[]> {
  const delay = forcedDelayMs ?? getRandomDelay();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal?.aborted) {
        return reject(new DOMException('Aborted search request', 'AbortError'));
      }

      if (mockApiConfig.simulateNetworkErrors && Math.random() > 0.5) {
        return reject(new Error('Simulated network connection error. Please try again.'));
      }

      let results = [...INITIAL_PRODUCTS];
      if (categoryId) {
        results = results.filter((p) => p.categoryId === categoryId);
      }
      resolve(results);
    }, delay);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted search request', 'AbortError'));
      });
    }
  });
}

export async function searchProductsApi(
  query: string,
  requestId: string,
  signal?: AbortSignal,
  forcedDelayMs?: number
): Promise<SearchApiResponse> {
  const delay = forcedDelayMs ?? getRandomDelay();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal?.aborted) {
        return reject(new DOMException('Aborted search request', 'AbortError'));
      }

      if (mockApiConfig.simulateNetworkErrors) {
        return reject(new Error('Network error: Search service unreachable'));
      }

      const q = query.trim().toLowerCase();
      let results: Product[] = [];
      if (q) {
        results = INITIAL_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        );
      }

      resolve({
        results,
        query,
        timestamp: Date.now(),
        requestId,
      });
    }, delay);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted search request', 'AbortError'));
      });
    }
  });
}
