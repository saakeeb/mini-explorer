"use client";

import * as React from "react";
import { FolderPlus, FilePlus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/store/workspace-store";

interface EmptyStateProps {
  folderId: string;
  folderName: string;
}

export function EmptyState({ folderId, folderName }: EmptyStateProps) {
  const openDialog = useWorkspaceStore((state) => state.openDialog);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-3">
        <Folder className="w-6 h-6 opacity-70" />
      </div>

      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
        &quot;{folderName}&quot; is empty
      </h3>
      <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
        Create a new folder or text file to organize your work in this directory.
      </p>

      <div className="flex items-center gap-2.5 mt-5">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            openDialog({
              type: "create",
              itemType: "folder",
              parentId: folderId,
            })
          }
        >
          <FolderPlus className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>New Folder</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            openDialog({
              type: "create",
              itemType: "file",
              parentId: folderId,
            })
          }
        >
          <FilePlus className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>New File</span>
        </Button>
      </div>
    </div>
  );
}
