import { create } from 'zustand';
import { Product } from '../types';
import { searchProductsApi } from '../api/mockApi';

interface RequestLogEntry {
  id: string;
  query: string;
  startedAt: number;
  completedAt?: number;
  latencyMs: number;
  status: 'pending' | 'fulfilled' | 'aborted' | 'rejected_stale';
}

interface SearchState {
  query: string;
  results: Product[];
  isLoading: boolean;
  error: string | null;
  
  // Engineering Challenge A features
  isStaleProtectionEnabled: boolean;
  activeRequestId: string | null;
  requestLogs: RequestLogEntry[];
  
  // Actions
  setQuery: (query: string) => void;
  executeSearch: (searchQuery: string, forcedLatencyMs?: number) => Promise<void>;
  toggleStaleProtection: () => void;
  clearRequestLogs: () => void;
  resetSearch: () => void;
}

let activeAbortController: AbortController | null = null;

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isLoading: false,
  error: null,
  isStaleProtectionEnabled: true,
  activeRequestId: null,
  requestLogs: [],

  setQuery: (query) => set({ query }),

  executeSearch: async (searchQuery: string, forcedLatencyMs?: number) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      set({ results: [], isLoading: false, error: null });
      return;
    }

    // Generate unique request ID
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const startTime = Date.now();

    // Stale protection mechanism 1: Abort previous pending network request if protection is ON
    if (get().isStaleProtectionEnabled && activeAbortController) {
      activeAbortController.abort('New search request initiated');
    }

    const controller = new AbortController();
    if (get().isStaleProtectionEnabled) {
      activeAbortController = controller;
    }

    set((state) => ({
      isLoading: true,
      error: null,
      activeRequestId: requestId,
      requestLogs: [
        {
          id: requestId,
          query: trimmed,
          startedAt: startTime,
          latencyMs: forcedLatencyMs || 0,
          status: 'pending',
        },
        ...state.requestLogs,
      ],
    }));

    try {
      const response = await searchProductsApi(
        trimmed,
        requestId,
        get().isStaleProtectionEnabled ? controller.signal : undefined,
        forcedLatencyMs
      );

      const endTime = Date.now();
      const currentActiveId = get().activeRequestId;
      const isProtectionOn = get().isStaleProtectionEnabled;

      // Stale protection mechanism 2: Guard against out-of-order responses
      if (isProtectionOn && response.requestId !== currentActiveId) {
        // Stale response detected! Drop it without updating UI state.
        set((state) => ({
          requestLogs: state.requestLogs.map((log) =>
            log.id === requestId
              ? { ...log, completedAt: endTime, status: 'rejected_stale' }
              : log
          ),
        }));
        return;
      }

      // Valid current response
      set((state) => ({
        results: response.results,
        isLoading: false,
        requestLogs: state.requestLogs.map((log) =>
          log.id === requestId ? { ...log, completedAt: endTime, status: 'fulfilled' } : log
        ),
      }));
    } catch (err: unknown) {
      const errorObj = err as { name?: string; message?: string };
      if (errorObj?.name === 'AbortError') {
        set((state) => ({
          requestLogs: state.requestLogs.map((log) =>
            log.id === requestId
              ? { ...log, completedAt: Date.now(), status: 'aborted' }
              : log
          ),
        }));
        return;
      }

      set((state) => ({
        isLoading: false,
        error: errorObj?.message || 'Search failed',
        requestLogs: state.requestLogs.map((log) =>
          log.id === requestId ? { ...log, completedAt: Date.now(), status: 'rejected_stale' } : log
        ),
      }));
    }
  },

  toggleStaleProtection: () =>
    set((state) => ({ isStaleProtectionEnabled: !state.isStaleProtectionEnabled })),

  clearRequestLogs: () => set({ requestLogs: [] }),

  resetSearch: () => set({ query: '', results: [], isLoading: false, error: null }),
}));
