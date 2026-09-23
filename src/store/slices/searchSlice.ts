import { findNode, findParent, getAncestors } from "@/lib/tree";
import { SearchActions, WorkspaceSlice } from "../types";
import { saveWorkspace } from "@/lib/persistence";
import { ROOT_ID } from "@/lib/constants";

export const createSearchSlice: WorkspaceSlice<SearchActions> = (
    set,
    get
) => ({
    setSearchQuery: (query) =>
        set({ searchQuery: query }),

    setIsSearchOpen: (open) =>
        set({ isSearchOpen: open }),

    navigateToItem: (itemId: string) => {
        const { root, expandedFolderIds } = get();
        const node = findNode(root, itemId);
        if (!node) return;

        const ancestors = getAncestors(root, itemId);
        const nextExpanded = new Set(expandedFolderIds);
        ancestors.forEach((a) => nextExpanded.add(a.id));

        if (node.type === "folder") {
            set({
                selectedFolderId: node.id,
                selectedFileId: null,
                expandedFolderIds: nextExpanded,
                searchQuery: "",
                isSearchOpen: false,
            });
            saveWorkspace({
                root,
                selectedFolderId: node.id,
                selectedFileId: null,
                expandedFolderIds: Array.from(nextExpanded),
            });
        } else {
            const parent = findParent(root, node.id);
            const folderId = parent ? parent.id : ROOT_ID;
            set({
                selectedFolderId: folderId,
                selectedFileId: node.id,
                expandedFolderIds: nextExpanded,
                searchQuery: "",
                isSearchOpen: false,
            });
            saveWorkspace({
                root,
                selectedFolderId: folderId,
                selectedFileId: node.id,
                expandedFolderIds: Array.from(nextExpanded),
            });
        }
    },
});