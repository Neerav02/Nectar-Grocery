import { describe, it, expect, beforeEach } from 'vitest';
import { useSearchStore } from '../stores/useSearchStore';

describe('useSearchStore — Challenge A: Stale Search Guard & Race Condition Protection', () => {
  beforeEach(() => {
    useSearchStore.getState().resetSearch();
    useSearchStore.getState().clearRequestLogs();
  });

  it('should initialize with empty state and stale protection enabled by default', () => {
    const state = useSearchStore.getState();
    expect(state.query).toBe('');
    expect(state.isLoading).toBe(false);
    expect(state.results).toEqual([]);
    expect(state.isStaleProtectionEnabled).toBe(true);
  });

  it('should prevent out-of-order race conditions when a fast query follows a slow query', async () => {
    // Challenge A Race Condition Scenario:
    // Query 1: 'milk' initiated with 600ms latency.
    // Query 2: 'apple' initiated 10ms later with 50ms latency.
    // Result: Query 2 resolves first. When Query 1 resolves later, it MUST be discarded.

    const slowPromise = useSearchStore.getState().executeSearch('milk', 600);
    const slowRequestId = useSearchStore.getState().activeRequestId;

    // Immediately trigger faster query
    const fastPromise = useSearchStore.getState().executeSearch('apple', 50);
    const fastRequestId = useSearchStore.getState().activeRequestId;

    expect(fastRequestId).not.toBe(slowRequestId);

    // Await both promises to complete
    await Promise.allSettled([slowPromise, fastPromise]);

    const state = useSearchStore.getState();

    // 1. The active request ID must remain the fast query ('apple')
    expect(state.activeRequestId).toBe(fastRequestId);

    // 2. The active search results must contain 'apple' products, not 'milk'
    expect(state.results.every((p) => p.name.toLowerCase().includes('apple') || p.categoryId === 'fruits-veg')).toBe(true);

    // 3. Request logs must prove that the slow query was aborted or rejected as stale
    const slowLog = state.requestLogs.find((l) => l.id === slowRequestId);
    expect(slowLog).toBeDefined();
    expect(['aborted', 'rejected_stale']).toContain(slowLog?.status);
  });

  it('should allow disabling stale protection for telemetry debugging', () => {
    const store = useSearchStore.getState();
    expect(store.isStaleProtectionEnabled).toBe(true);
    
    store.toggleStaleProtection();
    expect(useSearchStore.getState().isStaleProtectionEnabled).toBe(false);

    store.toggleStaleProtection();
    expect(useSearchStore.getState().isStaleProtectionEnabled).toBe(true);
  });
});
