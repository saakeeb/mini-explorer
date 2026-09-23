import { INITIAL_WORKSPACE_SEED, ROOT_ID, STORAGE_KEY } from "./constants";
import { WorkspaceNode } from "@/types/workspace";

export interface PersistedState {
  version: 1;
  root: WorkspaceNode;
  selectedFolderId: string;
  selectedFileId: string | null;
  expandedFolderIds: string[];
}

export function loadWorkspace(): PersistedState {
  if (typeof window === "undefined") {
    return {
      version: 1,
      root: INITIAL_WORKSPACE_SEED,
      selectedFolderId: ROOT_ID,
      selectedFileId: null,
      expandedFolderIds: [ROOT_ID],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        version: 1,
        root: INITIAL_WORKSPACE_SEED,
        selectedFolderId: ROOT_ID,
        selectedFileId: null,
        expandedFolderIds: [ROOT_ID],
      };
    }

    const parsed = JSON.parse(raw);
    if (
      parsed &&
      parsed.version === 1 &&
      parsed.root &&
      typeof parsed.root.id === "string"
    ) {
      return {
        version: 1,
        root: parsed.root,
        selectedFolderId: parsed.selectedFolderId || ROOT_ID,
        selectedFileId: parsed.selectedFileId || null,
        expandedFolderIds: Array.isArray(parsed.expandedFolderIds)
          ? parsed.expandedFolderIds
          : [ROOT_ID],
      };
    }
  } catch (error) {
    console.warn(
      "Failed to load workspace from localStorage, using seed:",
      error,
    );
  }

  return {
    version: 1,
    root: INITIAL_WORKSPACE_SEED,
    selectedFolderId: ROOT_ID,
    selectedFileId: null,
    expandedFolderIds: [ROOT_ID],
  };
}

export function saveWorkspace(state: {
  root: WorkspaceNode;
  selectedFolderId: string;
  selectedFileId: string | null;
  expandedFolderIds: string[];
}): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const payload: PersistedState = {
      version: 1,
      root: state.root,
      selectedFolderId: state.selectedFolderId,
      selectedFileId: state.selectedFileId,
      expandedFolderIds: state.expandedFolderIds,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error("Failed to save workspace to localStorage:", error);
    return false;
  }
}

export function clearWorkspace(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear workspace from localStorage:", error);
    }
  }
}
