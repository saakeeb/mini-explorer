"use client";

import { FileText, Save, X, Undo2 } from "lucide-react";
import { WorkspaceNode } from "@/src/types/workspace";
import { Button } from "../ui/Button";

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
    <div className="h-11 px-4 border-b border-[#DFE2DB] bg-[#FFFFFF] flex items-center justify-between gap-3 shrink-0 select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        <FileText className="w-4 h-4 text-[#5C5F58] shrink-0" />
        <span className="text-xs font-semibold text-[#1C1D1A] truncate font-mono">
          {file.name}
        </span>
        {isDirty ? (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-[#D97706] border border-amber-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            Unsaved changes
          </span>
        ) : (
          <span className="text-[11px] font-mono text-[#8B8F86] hidden sm:inline shrink-0">
            Saved
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isDirty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDiscard}
            title="Discard unsaved changes"
            className="text-[#5C5F58] hover:text-[#C24134] cursor-pointer"
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
          className="cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </Button>

        <div className="h-4 w-[1px] bg-[#DFE2DB] mx-0.5" />

        <button
          onClick={onClose}
          aria-label="Close editor"
          title="Close editor"
          className="p-1 rounded-[4px] text-[#8B8F86] hover:text-[#1C1D1A] hover:bg-[#F2F3F1] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
