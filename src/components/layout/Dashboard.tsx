"use client";

import { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "../ui/Breadcrumb";
import { EmptyState } from "../explorer/EmptyState";
import { FolderList } from "../explorer/FolderList";
import { FileList } from "../explorer/FileList";
import { FileEditor } from "../editor/FileEditor";
import { CreateModal } from "../modals/CreateModal";
import { RenameModal } from "../modals/RenameModal";
import { DeleteModal } from "../modals/DeleteModal";
import { UnsavedModal } from "../modals/UnsavedModal";
import { ToastContainer } from "../ui/Toast";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";
import { useWorkspace } from "@/src/hooks/useWorkspace";
import { useWorkspaceStore } from "@/src/store/workspaceStore";

export function Dashboard() {
  const {
    selectedFolder,
    selectedFile,
    folderContents,
    isHydrated,
  } = useWorkspace();

  const hydrate = useWorkspaceStore((state) => state.hydrate);
  const activeDialog = useWorkspaceStore((state) => state.activeDialog);
  const closeDialog = useWorkspaceStore((state) => state.closeDialog);
  const selectFolder = useWorkspaceStore((state) => state.selectFolder);
  const selectFile = useWorkspaceStore((state) => state.selectFile);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const childFolders = useMemo(() => {
    return folderContents.filter((item) => item.type === "folder");
  }, [folderContents]);

  const childFiles = useMemo(() => {
    return folderContents.filter((item) => item.type === "file");
  }, [folderContents]);

  const isFolderEmpty = childFolders.length === 0 && childFiles.length === 0;

  if (!isHydrated) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#F7F7F5]">
        <div className="flex items-center gap-3 text-xs text-[#5C5F58] font-medium">
          <div className="w-4 h-4 rounded-full border-2 border-[#0F5C4B] border-t-transparent animate-spin" />
          <span>Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#F7F7F5]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[#F7F7F5] overflow-hidden">
        <header className="h-10 px-4 border-b border-[#DFE2DB] bg-[#FFFFFF] flex items-center shrink-0">
          <Breadcrumb />
        </header>

        <Toolbar />
        <div className="flex-1 flex min-h-0 overflow-hidden">

          <div
            className={`flex-1 flex flex-col min-w-0 overflow-y-auto p-4 md:p-6 transition-all ${selectedFile ? "hidden lg:flex lg:w-1/2 lg:flex-none" : "flex"
              }`}
          >
            {isFolderEmpty ? (
              <EmptyState
                folderId={selectedFolder.id}
                folderName={selectedFolder.name}
              />
            ) : (
              <div className="space-y-6 max-w-4xl">
                <FolderList
                  folders={childFolders}
                  selectedItemId={selectedItemId}
                  onSelectItem={(id) => setSelectedItemId(id)}
                  onOpenFolder={(id) => {
                    setSelectedItemId(id);
                    selectFolder(id);
                  }}
                />

                <FileList
                  files={childFiles}
                  selectedItemId={selectedItemId}
                  onSelectItem={(id) => setSelectedItemId(id)}
                  onOpenFile={(id) => {
                    setSelectedItemId(id);
                    selectFile(id);
                  }}
                />
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="flex-1 flex flex-col min-w-0 h-full">
              <FileEditor file={selectedFile} />
            </div>
          )}
        </div>
      </main>

      {activeDialog?.type === "create" && (
        <CreateModal
          isOpen={true}
          itemType={activeDialog.itemType}
          parentId={activeDialog.parentId}
          onClose={closeDialog}
        />
      )}

      {activeDialog?.type === "rename" && (
        <RenameModal
          isOpen={true}
          node={activeDialog.node}
          onClose={closeDialog}
        />
      )}

      {activeDialog?.type === "delete" && (
        <DeleteModal
          isOpen={true}
          node={activeDialog.node}
          onClose={closeDialog}
        />
      )}

      {activeDialog?.type === "unsaved" && (
        <UnsavedModal
          isOpen={true}
          fileId={activeDialog.fileId}
          fileName={activeDialog.fileName}
          onClose={closeDialog}
          onConfirm={activeDialog.onConfirm}
        />
      )}

      <ToastContainer />
    </div>
  );
}
