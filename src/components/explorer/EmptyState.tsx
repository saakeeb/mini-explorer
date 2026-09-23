"use client";

import * as React from "react";
import { FolderPlus, FilePlus, Folder } from "lucide-react";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { Button } from "../ui/Button";

interface EmptyStateProps {
  folderId: string;
  folderName: string;
}

export function EmptyState({ folderId, folderName }: EmptyStateProps) {
  const openDialog = useWorkspaceStore((state) => state.openDialog);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-full bg-[#F2F3F1] border border-[#DFE2DB] flex items-center justify-center text-[#C98A2E] mb-3">
        <Folder className="w-6 h-6 opacity-70" />
      </div>

      <h3 className="text-sm font-semibold text-[#1C1D1A]">
        &quot;{folderName}&quot; is empty
      </h3>
      <p className="mt-1 text-xs text-[#5C5F58] max-w-xs leading-relaxed">
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
          className="cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5 text-[#C98A2E]" />
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
          className="cursor-pointer"
        >
          <FilePlus className="w-3.5 h-3.5 text-[#0F5C4B]" />
          <span>New File</span>
        </Button>
      </div>
    </div>
  );
}
