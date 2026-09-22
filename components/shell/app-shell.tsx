"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { Breadcrumb } from "./breadcrumb";
import { FolderList } from "@/components/explorer/folder-list";
import { FileList } from "@/components/explorer/file-list";
import { EmptyState } from "@/components/explorer/empty-state";
import { FileEditor } from "@/components/editor/file-editor";
import { CreateItemDialog } from "@/components/dialogs/create-item-dialog";
import { RenameDialog } from "@/components/dialogs/rename-dialog";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { UnsavedDialog } from "@/components/dialogs/unsaved-dialog";
import { ToastContainer } from "@/components/feedback/toast";
import { useWorkspace } from "@/hooks/use-workspace";
import { useWorkspaceStore } from "@/store/workspace-store";

export function AppShell() {
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

  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

  // Hydrate from localStorage on client mount
  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  const childFolders = React.useMemo(() => {
    return folderContents.filter((item) => item.type === "folder");
  }, [folderContents]);

  const childFiles = React.useMemo(() => {
    return folderContents.filter((item) => item.type === "file");
  }, [folderContents]);

  const isFolderEmpty = childFolders.length === 0 && childFiles.length === 0;

  if (!isHydrated) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[var(--background)]">
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] font-medium">
          <div className="w-4 h-4 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
          <span>Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[var(--background)]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--background)] overflow-hidden">
        {/* Top Breadcrumb Bar */}
        <header className="h-10 px-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center shrink-0">
          <Breadcrumb />
        </header>

        {/* Action Toolbar */}
        <Toolbar />

        {/* Workspace Explorer & Editor Layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Folder Contents Panel (Always visible on desktop, or hidden on mobile when editor is open) */}
          <div
            className={`flex-1 flex flex-col min-w-0 overflow-y-auto p-4 md:p-6 transition-all ${
              selectedFile ? "hidden lg:flex lg:w-1/2 lg:flex-none" : "flex"
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

          {/* Text File Editor Panel */}
          {selectedFile && (
            <div className="flex-1 flex flex-col min-w-0 h-full">
              <FileEditor file={selectedFile} />
            </div>
          )}
        </div>
      </main>

      {/* Global Dialogs */}
      {activeDialog?.type === "create" && (
        <CreateItemDialog
          isOpen={true}
          itemType={activeDialog.itemType}
          parentId={activeDialog.parentId}
          onClose={closeDialog}
        />
      )}

      {activeDialog?.type === "rename" && (
        <RenameDialog
          isOpen={true}
          node={activeDialog.node}
          onClose={closeDialog}
        />
      )}

      {activeDialog?.type === "delete" && (
        <DeleteDialog
          isOpen={true}
          node={activeDialog.node}
          onClose={closeDialog}
        />
      )}

      {activeDialog?.type === "unsaved" && (
        <UnsavedDialog
          isOpen={true}
          fileId={activeDialog.fileId}
          fileName={activeDialog.fileName}
          onClose={closeDialog}
          onConfirm={activeDialog.onConfirm}
        />
      )}

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
}
