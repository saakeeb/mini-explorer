"use client";

import {
  RotateCcw,
  X,
  FolderPlus,
  FilePlus,
} from "lucide-react";
import { TreeNode } from "../explorer/TreeNode";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { ROOT_ID } from "@/src/lib/constants";
import Image from "next/image";

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

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[280px] bg-[#EFEFEA] border-r border-[#DFE2DB] flex flex-col shrink-0 transition-transform duration-200 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 shadow-lg lg:shadow-none" : "-translate-x-full"
          }`}
      >
        <div className="h-12 px-4 border-b border-[#DFE2DB] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Image
              src="/webbly.png"
              alt="Webbly Mini Explorer Workspace"
              width={20}
              height={20}
              className="rounded shadow-2xs"
              priority
              sizes="20px"
            />
            <h2 className="text-xs font-semibold tracking-tight text-[#1C1D1A] uppercase">
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
              className="p-1 rounded-[6px] text-[#8B8F86] hover:text-[#1C1D1A] hover:bg-[#F2F3F1] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="lg:hidden p-1 rounded-[6px] text-[#8B8F86] hover:text-[#1C1D1A] hover:bg-[#F2F3F1] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-3 py-2 border-b border-[#DFE2DB] flex items-center justify-between text-xs text-[#5C5F58]">
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
              className="p-1 rounded-[6px] text-[#5C5F58] hover:text-[#1C1D1A] hover:bg-[#F2F3F1] transition-colors cursor-pointer"
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
              className="p-1 rounded-[6px] text-[#5C5F58] hover:text-[#1C1D1A] hover:bg-[#F2F3F1] transition-colors cursor-pointer"
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
        <div className="h-8 px-4 border-t border-[#DFE2DB] flex items-center justify-between text-[11px] text-[#8B8F86] shrink-0 font-mono">
          <span>Browser Storage</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A4A;]" />
            Active
          </span>
        </div>
      </aside>
    </>
  );
}
