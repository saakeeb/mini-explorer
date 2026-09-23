import { NavigationActions, WorkspaceSlice } from "../types";
import { findNode, findParent, getAncestors } from "@/lib/tree";
import { ROOT_ID } from "@/lib/constants";
import { saveWorkspace } from "@/lib/persistence";

export const createNavigationSlice: WorkspaceSlice<NavigationActions> = (
  set,
  get,
) => ({
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  selectFolder: (id) => {
    const { root, expandedFolderIds } = get();

    const folder = findNode(root, id);
    if (!folder || folder.type !== "folder") return;

    const nextExpanded = new Set(expandedFolderIds);

    getAncestors(root, id).forEach((a) => nextExpanded.add(a.id));

    set({
      selectedFolderId: id,
      selectedFileId: null,
      expandedFolderIds: nextExpanded,
    });

    saveWorkspace({
      root,
      selectedFolderId: id,
      selectedFileId: null,
      expandedFolderIds: [...nextExpanded],
    });
  },

  selectFile: (id: string | null) => {
    const { root, expandedFolderIds, selectedFolderId } = get();
    if (!id) {
      set({ selectedFileId: null });
      saveWorkspace({
        root,
        selectedFolderId,
        selectedFileId: null,
        expandedFolderIds: Array.from(expandedFolderIds),
      });
      return;
    }

    const file = findNode(root, id);
    if (!file || file.type !== "file") return;

    const parent = findParent(root, id);
    const newExpanded = new Set(expandedFolderIds);
    if (parent) {
      const ancestors = getAncestors(root, parent.id);
      ancestors.forEach((a) => newExpanded.add(a.id));
    }

    set({
      selectedFileId: id,
      selectedFolderId: parent ? parent.id : selectedFolderId,
      expandedFolderIds: newExpanded,
    });

    saveWorkspace({
      root,
      selectedFolderId: parent ? parent.id : selectedFolderId,
      selectedFileId: id,
      expandedFolderIds: Array.from(newExpanded),
    });
  },

  toggleFolder: (id: string) => {
    set((state) => {
      const nextExpanded = new Set(state.expandedFolderIds);
      if (nextExpanded.has(id)) {
        // Do not collapse root if root
        if (id !== ROOT_ID) {
          nextExpanded.delete(id);
        }
      } else {
        nextExpanded.add(id);
      }

      saveWorkspace({
        root: state.root,
        selectedFolderId: state.selectedFolderId,
        selectedFileId: state.selectedFileId,
        expandedFolderIds: Array.from(nextExpanded),
      });

      return { expandedFolderIds: nextExpanded };
    });
  },

  expandFolder: (id: string) => {
    set((state) => {
      if (state.expandedFolderIds.has(id)) return {};
      const nextExpanded = new Set(state.expandedFolderIds);
      nextExpanded.add(id);

      saveWorkspace({
        root: state.root,
        selectedFolderId: state.selectedFolderId,
        selectedFileId: state.selectedFileId,
        expandedFolderIds: Array.from(nextExpanded),
      });

      return { expandedFolderIds: nextExpanded };
    });
  },

  expandAncestors: (nodeId) => {
    const { root, expandedFolderIds } = get();

    const nextExpanded = new Set(expandedFolderIds);

    getAncestors(root, nodeId).forEach((a) => nextExpanded.add(a.id));

    set({ expandedFolderIds: nextExpanded });
  },
});
