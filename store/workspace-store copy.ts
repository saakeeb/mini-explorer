import { create } from "zustand";
import {
  ActiveDialog,
  ToastMessage,
  WorkspaceNode,
} from "@/types/workspace";
import {
  INITIAL_WORKSPACE_SEED,
  ROOT_ID,
} from "@/lib/constants";
import { generateId } from "@/lib/ids";
import {
  collectAllDescendantIds,
  deleteNode as deleteNodePure,
  findNode,
  findParent,
  getAncestors,
  insertNode as insertNodePure,
  renameNode as renameNodePure,
  updateFileContent as updateFileContentPure,
} from "@/lib/tree";
import {
  clearWorkspace,
  loadWorkspace,
  saveWorkspace,
} from "@/lib/persistence";

interface WorkspaceStoreState {
  // Tree & Navigation
  root: WorkspaceNode;
  selectedFolderId: string;
  selectedFileId: string | null;
  expandedFolderIds: Set<string>;

  // Search
  searchQuery: string;
  isSearchOpen: boolean;

  // File Editor & Dirty tracking
  draftContents: Record<string, string>;
  dirtyFiles: Set<string>;

  // Dialog & Feedback UI
  activeDialog: ActiveDialog;
  toasts: ToastMessage[];

  // Mobile sidebar state
  isSidebarOpen: boolean;

  // Hydration state
  isHydrated: boolean;

  // Actions
  hydrate: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  selectFolder: (id: string) => void;
  selectFile: (id: string | null) => void;
  toggleFolder: (id: string) => void;
  expandFolder: (id: string) => void;
  expandAncestors: (nodeId: string) => void;

  createFolder: (parentId: string, name: string) => boolean;
  createFile: (parentId: string, name: string, content?: string) => boolean;
  renameNode: (id: string, newName: string) => boolean;
  deleteNode: (id: string) => boolean;

  updateDraftContent: (fileId: string, content: string) => void;
  saveFile: (fileId: string) => boolean;
  discardFileChanges: (fileId: string) => void;

  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  navigateToItem: (itemId: string) => void;

  openDialog: (dialog: ActiveDialog) => void;
  closeDialog: () => void;

  addToast: (
    message: string,
    type?: "info" | "success" | "warning" | "danger"
  ) => void;
  removeToast: (id: string) => void;

  resetToSeed: () => void;
}

export const useWorkspaceStore = create<WorkspaceStoreState>((set, get) => ({
  root: INITIAL_WORKSPACE_SEED,
  selectedFolderId: ROOT_ID,
  selectedFileId: null,
  expandedFolderIds: new Set([ROOT_ID]),

  searchQuery: "",
  isSearchOpen: false,

  draftContents: {},
  dirtyFiles: new Set(),

  activeDialog: null,
  toasts: [],
  isSidebarOpen: false,
  isHydrated: false,

  hydrate: () => {
    const loaded = loadWorkspace();
    // Validate that selectedFolderId exists in tree
    const targetFolder = findNode(loaded.root, loaded.selectedFolderId);
    const validFolderId =
      targetFolder && targetFolder.type === "folder"
        ? targetFolder.id
        : ROOT_ID;

    // Validate that selectedFileId exists
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

  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  selectFolder: (id: string) => {
    const { root, expandedFolderIds } = get();
    const folder = findNode(root, id);
    if (!folder || folder.type !== "folder") return;

    const newExpanded = new Set(expandedFolderIds);
    const ancestors = getAncestors(root, id);
    ancestors.forEach((a) => newExpanded.add(a.id));

    set({
      selectedFolderId: id,
      selectedFileId: null, // closing file view to view folder contents
      expandedFolderIds: newExpanded,
    });

    saveWorkspace({
      root,
      selectedFolderId: id,
      selectedFileId: null,
      expandedFolderIds: Array.from(newExpanded),
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

  expandAncestors: (nodeId: string) => {
    const { root, expandedFolderIds } = get();
    const ancestors = getAncestors(root, nodeId);
    const nextExpanded = new Set(expandedFolderIds);
    ancestors.forEach((a) => nextExpanded.add(a.id));
    set({ expandedFolderIds: nextExpanded });
  },

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

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setIsSearchOpen: (open: boolean) => set({ isSearchOpen: open }),

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

  openDialog: (dialog: ActiveDialog) => set({ activeDialog: dialog }),
  closeDialog: () => set({ activeDialog: null }),

  addToast: (message, type = "info") => {
    const id = generateId();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3200);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
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
}));
