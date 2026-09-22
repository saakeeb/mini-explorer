"use client";

import * as React from "react";
import {
  FolderPlus,
  FilePlus,
  Pencil,
  Trash2,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./search-bar";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useWorkspace } from "@/hooks/use-workspace";
import { ROOT_ID } from "@/lib/constants";

export function Toolbar() {
  const { selectedFolder, selectedFile, selectedFolderId } = useWorkspace();
  const openDialog = useWorkspaceStore((state) => state.openDialog);
  const toggleSidebar = useWorkspaceStore((state) => state.toggleSidebar);

  const activeNode = selectedFile || selectedFolder;
  const isRootSelected = activeNode?.id === ROOT_ID;

  return (
    <div className="h-auto xl:h-12 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2 flex flex-col md:flex-row items-stretch xl:items-center justify-between gap-3 shrink-0 w-full">
      {/* Left side actions */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="xl:hidden p-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
        >
          <Menu className="w-4 h-4" />
        </button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            openDialog({
              type: "create",
              itemType: "folder",
              parentId: selectedFolderId,
            })
          }
        >
          <FolderPlus className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="hidden sm:inline">New Folder</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            openDialog({
              type: "create",
              itemType: "file",
              parentId: selectedFolderId,
            })
          }
        >
          <FilePlus className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span className="hidden sm:inline">New File</span>
        </Button>

        <div className="h-4 w-[1px] bg-[var(--border)] mx-1" />

        <Button
          variant="ghost"
          size="sm"
          disabled={!activeNode || isRootSelected}
          onClick={() => {
            if (activeNode) {
              openDialog({
                type: "rename",
                node: activeNode,
              });
            }
          }}
          title={isRootSelected ? "Cannot rename root workspace" : "Rename"}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rename</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={!activeNode || isRootSelected}
          onClick={() => {
            if (activeNode) {
              openDialog({
                type: "delete",
                node: activeNode,
              });
            }
          }}
          title={isRootSelected ? "Cannot delete root workspace" : "Delete"}
          className="hover:text-[var(--danger)] hover:bg-red-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>

      {/* Right side: Search */}
      <div className="flex items-center justify-end flex-1">
        <SearchBar />
      </div>
    </div>
  );
}
