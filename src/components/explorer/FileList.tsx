"use client";

import { WorkspaceNode } from "@/src/types/workspace";
import { ExplorerItem } from "./ExplorerItem";

interface FileListProps {
  files: WorkspaceNode[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onOpenFile: (id: string) => void;
}

export function FileList({
  files,
  selectedItemId,
  onSelectItem,
  onOpenFile,
}: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#8B8F86] uppercase">
        <span>Files ({files.length})</span>
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {files.map((file) => (
          <ExplorerItem
            key={file.id}
            node={file}
            isSelected={selectedItemId === file.id}
            onSelect={() => {
              onSelectItem(file.id);
              onOpenFile(file.id);
            }}
            onOpen={() => onOpenFile(file.id)}
          />
        ))}
      </div>
    </div>
  );
}
