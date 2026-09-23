"use client";

import React, { memo, useState } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { WorkspaceNode } from "@/types/workspace";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { ROOT_ID } from "@/lib/constants";

interface TreeNodeProps {
  node: WorkspaceNode;
  depth?: number;
}

export const TreeNode = memo(function TreeNode({
  node,
  depth = 0,
}: TreeNodeProps) {
  const selectedFolderId = useWorkspaceStore((state) => state.selectedFolderId);
  const selectedFileId = useWorkspaceStore((state) => state.selectedFileId);
  const expandedFolderIds = useWorkspaceStore(
    (state) => state.expandedFolderIds,
  );
  const dirtyFiles = useWorkspaceStore((state) => state.dirtyFiles);

  const selectFolder = useWorkspaceStore((state) => state.selectFolder);
  const selectFile = useWorkspaceStore((state) => state.selectFile);
  const toggleFolder = useWorkspaceStore((state) => state.toggleFolder);
  const openDialog = useWorkspaceStore((state) => state.openDialog);

  const isFolder = node.type === "folder";
  const isExpanded = expandedFolderIds.has(node.id);
  const isSelected = isFolder
    ? selectedFolderId === node.id && selectedFileId === null
    : selectedFileId === node.id;
  const isDirty = !isFolder && dirtyFiles.has(node.id);
  const isRoot = node.id === ROOT_ID;

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      selectFolder(node.id);
    } else {
      selectFile(node.id);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      toggleFolder(node.id);
    }
  };

  const childNodes = React.useMemo(() => {
    if (!isFolder || !node.children) return [];
    return [...node.children].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
  }, [isFolder, node.children]);

  return (
    <div
      role="none"
      className="select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        role="treeitem"
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (isFolder) {
              selectFolder(node.id);
            } else {
              selectFile(node.id);
            }
          } else if (e.key === "ArrowRight" && isFolder && !isExpanded) {
            e.preventDefault();
            toggleFolder(node.id);
          } else if (e.key === "ArrowLeft" && isFolder && isExpanded) {
            e.preventDefault();
            toggleFolder(node.id);
          }
        }}
        style={{ paddingLeft: `${Math.max(8, depth * 14 + 8)}px` }}
        className={`group flex items-center justify-between h-7 pr-2 text-xs rounded-[6px] cursor-pointer transition-colors duration-100 ${
          isSelected
            ? "bg-[#0F5C4B] text-white font-medium shadow-xs"
            : "text-[#1C1D1A] hover:bg-[#F2F3F1]"
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {/* Chevron expander for folders */}
          {isFolder ? (
            <button
              onClick={handleToggle}
              tabIndex={-1}
              aria-label={isExpanded ? "Collapse" : "Expand"}
              className={`p-0.5 rounded hover:bg-black/10 transition-transform duration-150 cursor-pointer ${
                isSelected ? "text-white/80 hover:text-white" : "text-[#8B8F86]"
              }`}
            >
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          {/* Node Icon */}
          {isFolder ? (
            isExpanded ? (
              <FolderOpen
                className={`w-3.5 h-3.5 shrink-0 ${
                  isSelected ? "text-white" : "text-[#C98A2E]"
                }`}
              />
            ) : (
              <Folder
                className={`w-3.5 h-3.5 shrink-0 ${
                  isSelected ? "text-white" : "text-[#C98A2E]"
                }`}
              />
            )
          ) : (
            <FileText
              className={`w-3.5 h-3.5 shrink-0 ${
                isSelected ? "text-white" : "text-[#5C5F58]"
              }`}
            />
          )}

          {/* Name label */}
          <span className="truncate tracking-tight">{node.name}</span>

          {/* Unsaved indicator */}
          {isDirty && (
            <span
              title="Unsaved changes"
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isSelected ? "bg-white" : "bg-[#D97706]"
              }`}
            />
          )}
        </div>

        {/* Quick action icons visible on hover or focus */}
        <div
          className={`flex items-center gap-1 transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {isFolder && (
            <button
              onClick={() =>
                openDialog({
                  type: "create",
                  itemType: "file",
                  parentId: node.id,
                })
              }
              title="New file in this folder"
              className={`p-0.5 rounded hover:bg-black/10 cursor-pointer ${
                isSelected
                  ? "text-white"
                  : "text-[#8B8F86] hover:text-[#1C1D1A]"
              }`}
            >
              <Plus className="w-3 h-3" />
            </button>
          )}

          {!isRoot && (
            <>
              <button
                onClick={() =>
                  openDialog({
                    type: "rename",
                    node,
                  })
                }
                title="Rename"
                className={`p-0.5 rounded hover:bg-black/10 cursor-pointer ${
                  isSelected
                    ? "text-white"
                    : "text-[#8B8F86] hover:text-[#1C1D1A]"
                }`}
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={() =>
                  openDialog({
                    type: "delete",
                    node,
                  })
                }
                title="Delete"
                className={`p-0.5 rounded hover:bg-black/10 cursor-pointer ${
                  isSelected
                    ? "text-white"
                    : "text-[#8B8F86] hover:text-[#C24134]"
                }`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recursive children if expanded */}
      {isFolder && isExpanded && childNodes.length > 0 && (
        <div
          role="group"
          className="border-l-[1px] border-[#DFE2DB] ml-3.5 my-0.5"
        >
          {childNodes.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = "TreeNode";
