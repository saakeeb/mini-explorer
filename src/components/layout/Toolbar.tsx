"use client";

import {
  FolderPlus,
  FilePlus,
  Pencil,
  Trash2,
  Menu,
} from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useWorkspace } from "@/hooks/useWorkspace";
import { ROOT_ID } from "@/lib/constants";
import { Button } from "../ui/Button";
import { SearchBar } from "./SearchBar";

export function Toolbar() {
  const { selectedFolder, selectedFile, selectedFolderId } = useWorkspace();
  const openDialog = useWorkspaceStore((state) => state.openDialog);
  const toggleSidebar = useWorkspaceStore((state) => state.toggleSidebar);

  const activeNode = selectedFile || selectedFolder;
  const isRootSelected = activeNode?.id === ROOT_ID;

  return (
    <div className="h-auto lg:h-12 border-b border-[#DFE2DB] bg-[#FFFFFF] px-4 py-2 flex flex-col md:flex-row items-stretch xl:items-center justify-between gap-3 shrink-0 w-full">
      <div className="flex items-center gap-2 overflow-x-auto">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="lg:hidden p-1.5 rounded-[6px] text-[#5C5F58] hover:text-[#1C1D1A] hover:bg-[#F2F3F1] cursor-pointer"
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
          className="cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5 text-[#C98A2E]" />
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
          className="cursor-pointer"
        >
          <FilePlus className="w-3.5 h-3.5 text-[#0F5C4B]" />
          <span className="hidden sm:inline">New File</span>
        </Button>

        <div className="h-4 w-[1px] bg-[#DFE2DB] mx-1" />

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
          className="cursor-pointer"
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
          className="hover:text-[#C24134] hover:bg-red-50 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>

      <div className="flex items-center justify-end flex-1">
        <SearchBar />
      </div>
    </div>
  );
}
