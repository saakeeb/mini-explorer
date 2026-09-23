import { clearWorkspace, loadWorkspace } from "@/lib/persistence";
import { HydrationActions, WorkspaceSlice } from "../types";
import { findNode, getAncestors } from "@/lib/tree";
import { INITIAL_WORKSPACE_SEED, ROOT_ID } from "@/lib/constants";

export const createHydrationSlice: WorkspaceSlice<
    HydrationActions
> = (set, get) => ({
    hydrate: () => {
        const loaded = loadWorkspace();
        const targetFolder = findNode(loaded.root, loaded.selectedFolderId);
        const validFolderId =
            targetFolder && targetFolder.type === "folder"
                ? targetFolder.id
                : ROOT_ID;

        const validFileId = loaded.selectedFileId
            ? findNode(loaded.root, loaded.selectedFileId)?.id ?? null
            : null;

        const expandedSet = new Set(loaded.expandedFolderIds);
        expandedSet.add(ROOT_ID);
        if (validFolderId) {
            const ancestors = getAncestors(loaded.root, validFolderId);
            ancestors.forEach((a) => expandedSet.add(a.id));
        }

        set({
            root: loaded.root,
            selectedFolderId: validFolderId,
            selectedFileId: validFileId,
            expandedFolderIds: expandedSet,
            isHydrated: true,
        });
    },

    resetToSeed: () => {
        clearWorkspace();
        set({
            root: INITIAL_WORKSPACE_SEED,
            selectedFolderId: ROOT_ID,
            selectedFileId: null,
            expandedFolderIds: new Set([ROOT_ID]),
            dirtyFiles: new Set(),
            draftContents: {},
        });
        get().addToast("Workspace reset to initial seed.", "info");
    },
});