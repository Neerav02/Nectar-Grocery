import { describe, it, expect, beforeEach } from 'vitest';
import { useSearchStore } from '../stores/useSearchStore';

describe('useSearchStore - Stale Search Guard Logic', () => {
  beforeEach(() => {
    useSearchStore.getState().resetSearch();
  });

  it('should initialize with empty query and non-loading state', () => {
    const state = useSearchStore.getState();
    expect(state.query).toBe('');
    expect(state.isLoading).toBe(false);
    expect(state.results).toEqual([]);
    expect(state.error).toBe(null);
  });

  it('should update query string', () => {
    useSearchStore.getState().setQuery('organic apple');
    expect(useSearchStore.getState().query).toBe('organic apple');
  });

  it('should generate requestId when executing search', () => {
    const store = useSearchStore.getState();
    store.executeSearch('milk');
    const firstRequestId = useSearchStore.getState().activeRequestId;
    expect(firstRequestId).toBeTruthy();
  });

  it('should clear search query and results on resetSearch', () => {
    useSearchStore.getState().setQuery('banana');
    useSearchStore.getState().resetSearch();

    const state = useSearchStore.getState();
    expect(state.query).toBe('');
    expect(state.results).toEqual([]);
  });
});
