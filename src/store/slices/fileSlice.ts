import { generateId } from "@/lib/ids";
import { saveWorkspace } from "@/lib/persistence";
import { WorkspaceNode } from "@/types/workspace";
import { FileActions, WorkspaceSlice } from "../types";
import {
  findNode,
  insertNode as insertNodePure,
  updateFileContent as updateFileContentPure,
} from "@/lib/tree";

export const createFileSlice: WorkspaceSlice<FileActions> = (set, get) => ({
  createFile: (parentId: string, name: string, content = "") => {
    const { root, addToast } = get();
    const parent = findNode(root, parentId);
    if (!parent || parent.type !== "folder") {
      addToast("Failed to create file: parent directory not found.", "danger");
      return false;
    }

    const timestamp = new Date().toISOString();
    const fileId = generateId();
    const newFile: WorkspaceNode = {
      id: fileId,
      name: name.trim(),
      type: "file",
      parentId,
      content,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const updatedRoot = insertNodePure(root, parentId, newFile);
    const newExpanded = new Set(get().expandedFolderIds);
    newExpanded.add(parentId);

    set({
      root: updatedRoot,
      expandedFolderIds: newExpanded,
      selectedFolderId: parentId,
      selectedFileId: fileId, // Open the new file in editor immediately
    });

    saveWorkspace({
      root: updatedRoot,
      selectedFolderId: parentId,
      selectedFileId: fileId,
      expandedFolderIds: Array.from(newExpanded),
    });

    addToast(`File "${name.trim()}" created.`, "success");
    return true;
  },

  updateDraftContent: (fileId: string, content: string) => {
    const { root, dirtyFiles, draftContents } = get();
    const file = findNode(root, fileId);
    if (!file || file.type !== "file") return;

    const originalContent = file.content ?? "";
    const isDirty = content !== originalContent;

    const nextDirty = new Set(dirtyFiles);
    const nextDrafts = { ...draftContents };

    if (isDirty) {
      nextDirty.add(fileId);
      nextDrafts[fileId] = content;
    } else {
      nextDirty.delete(fileId);
      delete nextDrafts[fileId];
    }

    set({
      dirtyFiles: nextDirty,
      draftContents: nextDrafts,
    });
  },

  saveFile: (fileId: string) => {
    const { root, draftContents, dirtyFiles, addToast } = get();
    const file = findNode(root, fileId);
    if (!file || file.type !== "file") return false;

    const newContent = draftContents[fileId] ?? file.content ?? "";
    const updatedRoot = updateFileContentPure(root, fileId, newContent);

    const nextDirty = new Set(dirtyFiles);
    nextDirty.delete(fileId);

    const nextDrafts = { ...draftContents };
    delete nextDrafts[fileId];

    set({
      root: updatedRoot,
      dirtyFiles: nextDirty,
      draftContents: nextDrafts,
    });

    saveWorkspace({
      root: updatedRoot,
      selectedFolderId: get().selectedFolderId,
      selectedFileId: get().selectedFileId,
      expandedFolderIds: Array.from(get().expandedFolderIds),
    });

    addToast(`Saved "${file.name}".`, "success");
    return true;
  },

  discardFileChanges: (fileId: string) => {
    set((state) => {
      const nextDirty = new Set(state.dirtyFiles);
      nextDirty.delete(fileId);
      const nextDrafts = { ...state.draftContents };
      delete nextDrafts[fileId];
      return { dirtyFiles: nextDirty, draftContents: nextDrafts };
    });
  },
});
