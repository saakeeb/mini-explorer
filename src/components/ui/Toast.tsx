"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useWorkspaceStore } from "@/src/store/workspaceStore";

export function ToastContainer() {
  const toasts = useWorkspaceStore((state) => state.toasts);
  const removeToast = useWorkspaceStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4"
    >
      {toasts.map((toast) => {
        const icon =
          toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#1D7A4A;] shrink-0" />
          ) : toast.type === "danger" ? (
            <AlertCircle className="w-4 h-4 text-[#C24134] shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[#2563EB] shrink-0" />
          );

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 bg-[#FFFFFF] border border-[#DFE2DB] rounded-[8px] shadow-[var(--shadow-floating)] text-xs text-[#1C1D1A] animate-in slide-in-from-bottom-2 fade-in duration-150"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icon}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss toast"
              className="text-[#8B8F86] hover:text-[#1C1D1A] p-0.5 rounded transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
