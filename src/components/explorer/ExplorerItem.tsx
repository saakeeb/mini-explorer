"use client";

import { useMemo } from "react";
import { Folder, FileText, Pencil, Trash2 } from "lucide-react";
import { WorkspaceNode } from "@/types/workspace";
import { useWorkspaceStore } from "@/store/workspaceStore";

interface ExplorerItemProps {
  node: WorkspaceNode;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export function ExplorerItem({
  node,
  isSelected,
  onSelect,
  onOpen,
}: ExplorerItemProps) {
  const dirtyFiles = useWorkspaceStore((state) => state.dirtyFiles);
  const openDialog = useWorkspaceStore((state) => state.openDialog);

  const isFolder = node.type === "folder";
  const isDirty = !isFolder && dirtyFiles.has(node.id);

  const metadataText = useMemo(() => {
    if (isFolder) {
      const count = node.children?.length ?? 0;
      return `${count} item${count === 1 ? "" : "s"}`;
    }
    const len = node.content?.length ?? 0;
    return `${len} char${len === 1 ? "" : "s"}`;
  }, [isFolder, node.children, node.content]);

  return (
    <div
      role="row"
      tabIndex={0}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`group flex items-center justify-between h-11 px-3 rounded-[8px] border cursor-pointer select-none transition-colors duration-100 ${
        isSelected
          ? "bg-[#F2F3F1] border-[#C9CEC4] shadow-2xs"
          : "bg-[#FFFFFF] border-[#DFE2DB] hover:bg-[#F2F3F1] hover:border-[#C9CEC4]"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isFolder ? (
          <Folder className="w-4 h-4 text-[#C98A2E] shrink-0" />
        ) : (
          <FileText className="w-4 h-4 text-[#5C5F58] shrink-0" />
        )}

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-[#1C1D1A] truncate">
            {node.name}
          </span>
          {isDirty && (
            <span
              title="Unsaved changes"
              className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0"
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[11px] font-mono text-[#8B8F86] hidden sm:inline">
          {metadataText}
        </span>

        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() =>
              openDialog({
                type: "rename",
                node,
              })
            }
            title="Rename"
            className="p-1 rounded-[4px] text-[#8B8F86] hover:text-[#1C1D1A] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() =>
              openDialog({
                type: "delete",
                node,
              })
            }
            title="Delete"
            className="p-1 rounded-[4px] text-[#8B8F86] hover:text-[#C24134] hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
