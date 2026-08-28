import { create } from 'zustand';

interface AuditState {
  isAuditModeEnabled: boolean;
  toggleAuditMode: () => void;
  setAuditMode: (enabled: boolean) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  isAuditModeEnabled: false,
  toggleAuditMode: () => set((state) => ({ isAuditModeEnabled: !state.isAuditModeEnabled })),
  setAuditMode: (enabled) => set({ isAuditModeEnabled: enabled }),
}));
