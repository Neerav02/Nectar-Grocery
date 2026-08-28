import React, { useState } from 'react';
import { Bug, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ShieldAlert, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchStore } from '../../stores/useSearchStore';
import { PillButton } from '../common/PillButton';

export const StaleSearchDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isStaleProtectionEnabled = useSearchStore((state) => state.isStaleProtectionEnabled);
  const toggleStaleProtection = useSearchStore((state) => state.toggleStaleProtection);
  const requestLogs = useSearchStore((state) => state.requestLogs);
  const clearRequestLogs = useSearchStore((state) => state.clearRequestLogs);
  const executeSearch = useSearchStore((state) => state.executeSearch);
  const setQuery = useSearchStore((state) => state.setQuery);

  const handleSimulateRaceCondition = async () => {
    clearRequestLogs();

    // 1. Fire slow request for "milk" (1200ms latency)
    setQuery('milk');
    executeSearch('milk', 1200);

    // 2. Wait 100ms, then fire fast request for "apple" (200ms latency)
    setTimeout(() => {
      setQuery('apple');
      executeSearch('apple', 200);
    }, 100);
  };

  return (
    <div className="bg-[#181725] text-white rounded-2xl overflow-hidden shadow-md border border-gray-800 my-4 transition-all">
      {/* Header Bar Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors text-left"
      >
        <div className="flex items-center space-x-2.5">
          <Bug className="w-5 h-5 text-[#53B175]" />
          <div>
            <h3 className="font-bold text-sm text-white">Challenge A: Stale Search QA Test</h3>
            <p className="text-[11px] text-gray-400">Click to expand race-condition telemetry controls</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isStaleProtectionEnabled
                ? 'bg-[#53B175]/20 text-[#53B175] border border-[#53B175]/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {isStaleProtectionEnabled ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            <span>{isStaleProtectionEnabled ? 'Protection ON' : 'Protection OFF'}</span>
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {/* Expanded Controls & Telemetry Stream */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-800/80 animate-fade-in">
          <div className="py-3">
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              Fires slow request A (&quot;milk&quot;, 1200ms) followed by fast request B (&quot;apple&quot;, 200ms). When protection is ON, Request A is aborted/rejected so old data never overwrites Request B.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <PillButton
                  size="sm"
                  onClick={handleSimulateRaceCondition}
                  className="w-auto text-xs bg-[#53B175] hover:bg-[#439B63] py-2 px-4"
                >
                  Trigger Race Test (&quot;milk&quot; vs &quot;apple&quot;)
                </PillButton>

                <button
                  type="button"
                  onClick={toggleStaleProtection}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all border ${
                    isStaleProtectionEnabled
                      ? 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
                      : 'bg-[#53B175]/20 text-[#53B175] border-[#53B175]/40 hover:bg-[#53B175]/30'
                  }`}
                >
                  Toggle {isStaleProtectionEnabled ? 'OFF' : 'ON'}
                </button>
              </div>

              <button
                type="button"
                onClick={clearRequestLogs}
                className="inline-flex items-center space-x-1 text-xs text-gray-400 hover:text-white px-2 py-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>

          {/* Request Stream Telemetry */}
          {requestLogs.length > 0 && (
            <div className="mt-2 bg-black/40 rounded-xl p-3 border border-gray-800/80">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Telemetry Log Stream
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {requestLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-xs p-2 rounded bg-gray-900/80 border border-gray-800/80 font-mono"
                  >
                    <div className="flex items-center space-x-2">
                      {log.status === 'fulfilled' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {log.status === 'aborted' && (
                        <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      {log.status === 'rejected_stale' && (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      {log.status === 'pending' && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      )}
                      <span className="text-gray-200 font-semibold">&quot;{log.query}&quot;</span>
                      <span className="text-gray-500 text-[10px]">[{log.id.slice(-6)}]</span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className="text-gray-400">{log.latencyMs}ms</span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          log.status === 'fulfilled'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : log.status === 'aborted'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : log.status === 'rejected_stale'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-blue-950 text-blue-300'
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
