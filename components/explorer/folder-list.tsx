"use client";

import * as React from "react";
import { WorkspaceNode } from "@/types/workspace";
import { ExplorerItem } from "./explorer-item";

interface FolderListProps {
  folders: WorkspaceNode[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onOpenFolder: (id: string) => void;
}

export function FolderList({
  folders,
  selectedItemId,
  onSelectItem,
  onOpenFolder,
}: FolderListProps) {
  if (folders.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
        <span>Folders ({folders.length})</span>
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {folders.map((folder) => (
          <ExplorerItem
            key={folder.id}
            node={folder}
            isSelected={selectedItemId === folder.id}
            onSelect={() => onSelectItem(folder.id)}
            onOpen={() => onOpenFolder(folder.id)}
          />
        ))}
      </div>
    </div>
  );
}
