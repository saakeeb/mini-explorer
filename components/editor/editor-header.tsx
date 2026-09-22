"use client";

import * as React from "react";
import { FileText, Save, X, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceNode } from "@/types/workspace";

interface EditorHeaderProps {
  file: WorkspaceNode;
  isDirty: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onClose: () => void;
}

export function EditorHeader({
  file,
  isDirty,
  onSave,
  onDiscard,
  onClose,
}: EditorHeaderProps) {
  return (
    <div className="h-11 px-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3 shrink-0 select-none">
      {/* File info */}
      <div className="flex items-center gap-2.5 min-w-0">
        <FileText className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
        <span className="text-xs font-semibold text-[var(--text-primary)] truncate font-mono">
          {file.name}
        </span>

        {/* Unsaved indicator */}
        {isDirty ? (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-[var(--warning)] border border-amber-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] animate-pulse" />
            Unsaved changes
          </span>
        ) : (
          <span className="text-[11px] font-mono text-[var(--text-tertiary)] hidden sm:inline shrink-0">
            Saved
          </span>
        )}
      </div>

      {/* Editor actions */}
      <div className="flex items-center gap-2 shrink-0">
        {isDirty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDiscard}
            title="Discard unsaved changes"
            className="text-[var(--text-secondary)] hover:text-[var(--danger)]"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Discard</span>
          </Button>
        )}

        <Button
          variant={isDirty ? "primary" : "secondary"}
          size="sm"
          disabled={!isDirty}
          onClick={onSave}
          title="Save file (Ctrl + S)"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </Button>

        <div className="h-4 w-[1px] bg-[var(--border)] mx-0.5" />

        <button
          onClick={onClose}
          aria-label="Close editor"
          title="Close editor"
          className="p-1 rounded-[var(--radius-xs)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
        >
          <X className="w-4 h-4 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
