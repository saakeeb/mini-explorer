"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspace-store";

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
            <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
          ) : toast.type === "danger" ? (
            <AlertCircle className="w-4 h-4 text-[var(--danger)] shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[var(--info)] shrink-0" />
          );

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-[var(--shadow-floating)] text-xs text-[var(--text-primary)] animate-in slide-in-from-bottom-2 fade-in duration-150"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icon}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss toast"
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-0.5 rounded transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
