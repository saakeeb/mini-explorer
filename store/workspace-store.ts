import { create } from "zustand";
import { ROOT_ID, INITIAL_WORKSPACE_SEED } from "@/lib/constants";
import { WorkspaceStore } from "./types";

import { createNavigationSlice } from "./slices/navigation-slice";
import { createFolderSlice } from "./slices/folder-slice";
import { createFileSlice } from "./slices/file-slice";
import { createSearchSlice } from "./slices/search-slice";
import { createHydrationSlice } from "./slices/hydration-slice";
import { createToastSlice } from "./slices/toast-slice";
import { createUISlice } from "./slices/ui-slice";

export const useWorkspaceStore = create<WorkspaceStore>()(
  (set, get, api) => ({
    // Initial State
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

    // Merge slices
    ...createNavigationSlice(set, get, api),
    ...createFolderSlice(set, get, api),
    ...createFileSlice(set, get, api),
    ...createSearchSlice(set, get, api),
    ...createHydrationSlice(set, get, api),
    ...createToastSlice(set, get, api),
    ...createUISlice(set, get, api),
  })
);