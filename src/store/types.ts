import { StateCreator } from "zustand";
import {
    ActiveDialog,
    ToastMessage,
    WorkspaceNode,
} from "@/src/types/workspace";

export interface WorkspaceState {
    // Tree
    root: WorkspaceNode;
    selectedFolderId: string;
    selectedFileId: string | null;
    expandedFolderIds: Set<string>;

    // Search
    searchQuery: string;
    isSearchOpen: boolean;

    // Editor
    draftContents: Record<string, string>;
    dirtyFiles: Set<string>;

    // UI
    activeDialog: ActiveDialog;
    toasts: ToastMessage[];
    isSidebarOpen: boolean;
    isHydrated: boolean;
}

export interface NavigationActions {
    selectFolder(id: string): void;
    selectFile(id: string | null): void;
    toggleFolder(id: string): void;
    expandFolder(id: string): void;
    expandAncestors(id: string): void;
    setSidebarOpen(open: boolean): void;
    toggleSidebar(): void;
}

export interface FolderActions {
    createFolder(parentId: string, name: string): boolean;
    renameNode(id: string, newName: string): boolean;
    deleteNode(id: string): boolean;
}

export interface FileActions {
    createFile(parentId: string, name: string, content?: string): boolean;
    updateDraftContent(fileId: string, content: string): void;
    saveFile(fileId: string): boolean;
    discardFileChanges(fileId: string): void;
}

export interface SearchActions {
    setSearchQuery(query: string): void;
    setIsSearchOpen(open: boolean): void;
    navigateToItem(itemId: string): void;
}

export interface HydrationActions {
    hydrate(): void;
    resetToSeed(): void;
}

export interface UIActions {
    openDialog(dialog: ActiveDialog): void;
    closeDialog(): void;
}

export interface ToastActions {
    addToast(
        message: string,
        type?: "info" | "success" | "warning" | "danger"
    ): void;
    removeToast(id: string): void;
}

export type WorkspaceStore = WorkspaceState &
    NavigationActions &
    FolderActions &
    FileActions &
    SearchActions &
    HydrationActions &
    UIActions &
    ToastActions;

export type WorkspaceSlice<T> = StateCreator<
    WorkspaceStore,
    [],
    [],
    T
>;