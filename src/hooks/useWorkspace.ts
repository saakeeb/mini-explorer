"use client";

import { useMemo } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { findNode, getBreadcrumbs } from "@/lib/tree";

export function useWorkspace() {
  const root = useWorkspaceStore((state) => state.root);
  const selectedFolderId = useWorkspaceStore((state) => state.selectedFolderId);
  const selectedFileId = useWorkspaceStore((state) => state.selectedFileId);
  const expandedFolderIds = useWorkspaceStore((state) => state.expandedFolderIds);
  const dirtyFiles = useWorkspaceStore((state) => state.dirtyFiles);
  const draftContents = useWorkspaceStore((state) => state.draftContents);
  const isHydrated = useWorkspaceStore((state) => state.isHydrated);
  const isSidebarOpen = useWorkspaceStore((state) => state.isSidebarOpen);

  const selectedFolder = useMemo(() => {
    const node = findNode(root, selectedFolderId);
    return node && node.type === "folder" ? node : root;
  }, [root, selectedFolderId]);

  const selectedFile = useMemo(() => {
    if (!selectedFileId) return null;
    const node = findNode(root, selectedFileId);
    return node && node.type === "file" ? node : null;
  }, [root, selectedFileId]);

  const folderContents = useMemo(() => {
    const children = selectedFolder.children ?? [];
    return [...children].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
  }, [selectedFolder]);

  const breadcrumbs = useMemo(() => {
    const targetId = selectedFileId || selectedFolderId;
    return getBreadcrumbs(root, targetId);
  }, [root, selectedFolderId, selectedFileId]);

  return {
    root,
    selectedFolderId,
    selectedFileId,
    selectedFolder,
    selectedFile,
    folderContents,
    breadcrumbs,
    expandedFolderIds,
    dirtyFiles,
    draftContents,
    isHydrated,
    isSidebarOpen,
  };
}
