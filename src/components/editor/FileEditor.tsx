"use client";

import { useEffect, useMemo, useRef } from "react";
import { WorkspaceNode } from "@/src/types/workspace";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { EditorHeader } from "./EditorHeader";

interface FileEditorProps {
  file: WorkspaceNode;
}

export function FileEditor({ file }: FileEditorProps) {
  const dirtyFiles = useWorkspaceStore((state) => state.dirtyFiles);
  const draftContents = useWorkspaceStore((state) => state.draftContents);
  const updateDraftContent = useWorkspaceStore(
    (state) => state.updateDraftContent
  );
  const saveFile = useWorkspaceStore((state) => state.saveFile);
  const discardFileChanges = useWorkspaceStore(
    (state) => state.discardFileChanges
  );
  const selectFile = useWorkspaceStore((state) => state.selectFile);
  const openDialog = useWorkspaceStore((state) => state.openDialog);

  const isDirty = dirtyFiles.has(file.id);
  const currentContent = draftContents[file.id] ?? file.content ?? "";

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (isDirty) {
          saveFile(file.id);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [file.id, isDirty, saveFile]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateDraftContent(file.id, e.target.value);
  };

  const handleSave = () => {
    saveFile(file.id);
  };

  const handleDiscard = () => {
    discardFileChanges(file.id);
  };

  const handleClose = () => {
    if (isDirty) {
      openDialog({
        type: "unsaved",
        fileId: file.id,
        fileName: file.name,
        onConfirm: () => {
          selectFile(null);
        },
      });
    } else {
      selectFile(null);
    }
  };

  const linesCount = useMemo(() => {
    return currentContent.split("\n").length;
  }, [currentContent]);

  const charCount = currentContent.length;
  const wordCount = useMemo(() => {
    const trimmed = currentContent.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [currentContent]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FFFFFF] border-l border-[#DFE2DB] overflow-hidden animate-in fade-in duration-150">
      <EditorHeader
        file={file}
        isDirty={isDirty}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onClose={handleClose}
      />

      <div className="flex-1 flex min-h-0 relative">
        <textarea
          ref={textareaRef}
          value={currentContent}
          onChange={handleChange}
          aria-label={`Editing ${file.name}`}
          placeholder="Start typing your notes or text here..."
          spellCheck={false}
          className="w-full h-full p-4 md:p-6 text-sm font-mono text-[#1C1D1A] bg-[#FFFFFF] placeholder:text-[#8B8F86] resize-none border-none outline-none leading-relaxed overflow-y-auto selection:bg-[#0F5C4B]"
        />
      </div>

      <div className="h-7 px-4 border-t border-[#DFE2DB] bg-[#F2F3F1] text-[11px] font-mono text-[#8B8F86] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-4">
          <span>{linesCount} lines</span>
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-2">
          <span>UTF-8</span>
          <span>Plain Text</span>
        </div>
      </div>
    </div>
  );
}
