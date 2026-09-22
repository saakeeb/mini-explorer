"use client";

import * as React from "react";
import {
  FolderTree,
  RotateCcw,
  X,
  ChevronDown,
  FolderPlus,
  FilePlus,
} from "lucide-react";
import { useWorkspaceStore } from "@/store/workspace-store";
import { TreeNode } from "@/components/explorer/tree-node";
import { ROOT_ID } from "@/lib/constants";

export function Sidebar() {
  const root = useWorkspaceStore((state) => state.root);
  const selectedFolderId = useWorkspaceStore((state) => state.selectedFolderId);
  const isSidebarOpen = useWorkspaceStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useWorkspaceStore((state) => state.setSidebarOpen);
  const openDialog = useWorkspaceStore((state) => state.openDialog);
  const resetToSeed = useWorkspaceStore((state) => state.resetToSeed);

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 xl:hidden animate-in fade-in duration-150"
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed xl:static inset-y-0 left-0 z-40 w-[280px] bg-[var(--sidebar)] border-r border-[var(--border)] flex flex-col shrink-0 transition-transform duration-200 xl:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-lg xl:shadow-none" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-12 px-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              W
            </div>
            <h2 className="text-xs font-semibold tracking-tight text-[var(--text-primary)] uppercase">
              Workspace
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (
                  confirm("Reset workspace to initial demo files and folders?")
                ) {
                  resetToSeed();
                }
              }}
              title="Reset workspace to default demo files"
              className="p-1 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="xl:hidden p-1 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick actions row inside sidebar */}
        <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span className="font-medium">Explorer</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                openDialog({
                  type: "create",
                  itemType: "folder",
                  parentId: selectedFolderId || ROOT_ID,
                })
              }
              title="New Folder"
              className="p-1 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() =>
                openDialog({
                  type: "create",
                  itemType: "file",
                  parentId: selectedFolderId || ROOT_ID,
                })
              }
              title="New Text File"
              className="p-1 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Tree Container */}
        <div
          role="tree"
          aria-label="Workspace Tree"
          className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5"
        >
          <TreeNode node={root} depth={0} />
        </div>

        {/* Bottom subtle status */}
        <div className="h-8 px-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)] shrink-0 font-mono">
          <span>Browser Storage</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
            Active
          </span>
        </div>
      </aside>
    </>
  );
}
