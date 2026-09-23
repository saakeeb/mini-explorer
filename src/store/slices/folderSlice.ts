import {
    collectAllDescendantIds, findNode, findParent,
    deleteNode as deleteNodePure,
    insertNode as insertNodePure,
    renameNode as renameNodePure,
} from "@/src/lib/tree";
import { FolderActions, WorkspaceSlice } from "../types";
import { WorkspaceNode } from "@/src/types/workspace";
import { generateId } from "@/src/lib/ids";
import { saveWorkspace } from "@/src/lib/persistence";
import { ROOT_ID } from "@/src/lib/constants";

export const createFolderSlice: WorkspaceSlice<
    FolderActions
> = (set, get) => ({
    createFolder: (parentId: string, name: string) => {
        const { root, addToast } = get();
        const parent = findNode(root, parentId);
        if (!parent || parent.type !== "folder") {
            addToast("Failed to create folder: parent directory not found.", "danger");
            return false;
        }

        const timestamp = new Date().toISOString();
        const newFolder: WorkspaceNode = {
            id: generateId(),
            name: name.trim(),
            type: "folder",
            parentId,
            children: [],
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const updatedRoot = insertNodePure(root, parentId, newFolder);
        const newExpanded = new Set(get().expandedFolderIds);
        newExpanded.add(parentId);

        set({
            root: updatedRoot,
            expandedFolderIds: newExpanded,
            selectedFolderId: parentId,
        });

        saveWorkspace({
            root: updatedRoot,
            selectedFolderId: parentId,
            selectedFileId: get().selectedFileId,
            expandedFolderIds: Array.from(newExpanded),
        });

        addToast(`Folder "${name.trim()}" created.`, "success");
        return true;
    },

    renameNode: (id: string, newName: string) => {
        const { root, addToast } = get();
        const trimmed = newName.trim();
        const node = findNode(root, id);
        if (!node) return false;

        const updatedRoot = renameNodePure(root, id, trimmed);

        set({ root: updatedRoot });

        saveWorkspace({
            root: updatedRoot,
            selectedFolderId: get().selectedFolderId,
            selectedFileId: get().selectedFileId,
            expandedFolderIds: Array.from(get().expandedFolderIds),
        });

        addToast(`Renamed to "${trimmed}".`, "success");
        return true;
    },

    deleteNode: (id: string) => {
        const {
            root,
            selectedFolderId,
            selectedFileId,
            expandedFolderIds,
            dirtyFiles,
            draftContents,
            addToast,
        } = get();

        if (id === ROOT_ID) {
            addToast("Cannot delete the root workspace.", "warning");
            return false;
        }

        const targetNode = findNode(root, id);
        if (!targetNode) return false;

        // Collect all descendant IDs being removed
        const descendantIds = new Set(collectAllDescendantIds(targetNode));

        // Handle selected file removal
        let nextFileId = selectedFileId;
        if (selectedFileId && descendantIds.has(selectedFileId)) {
            nextFileId = null;
        }

        // Handle selected folder removal
        let nextFolderId = selectedFolderId;
        if (descendantIds.has(selectedFolderId)) {
            const parent = findParent(root, id);
            nextFolderId = parent ? parent.id : ROOT_ID;
        }

        // Clean up expanded folders
        const nextExpanded = new Set(expandedFolderIds);
        descendantIds.forEach((dId) => nextExpanded.delete(dId));

        // Clean up dirty files and drafts
        const nextDirty = new Set(dirtyFiles);
        const nextDrafts = { ...draftContents };
        descendantIds.forEach((dId) => {
            nextDirty.delete(dId);
            delete nextDrafts[dId];
        });

        const updatedRoot = deleteNodePure(root, id);

        set({
            root: updatedRoot,
            selectedFolderId: nextFolderId,
            selectedFileId: nextFileId,
            expandedFolderIds: nextExpanded,
            dirtyFiles: nextDirty,
            draftContents: nextDrafts,
        });

        saveWorkspace({
            root: updatedRoot,
            selectedFolderId: nextFolderId,
            selectedFileId: nextFileId,
            expandedFolderIds: Array.from(nextExpanded),
        });

        addToast(`Deleted "${targetNode.name}".`, "info");
        return true;
    },
});