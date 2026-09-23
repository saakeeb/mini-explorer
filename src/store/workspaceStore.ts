import { create } from "zustand";
import { ROOT_ID, INITIAL_WORKSPACE_SEED } from "@/src/lib/constants";
import { WorkspaceStore } from "./types";

import { createNavigationSlice } from "./slices/navigationSlice";
import { createFolderSlice } from "./slices/folderSlice";
import { createFileSlice } from "./slices/fileSlice";
import { createSearchSlice } from "./slices/searchSlice";
import { createHydrationSlice } from "./slices/hydrationSlice";
import { createToastSlice } from "./slices/toastSlice";
import { createUISlice } from "./slices/uiSlice";

export const useWorkspaceStore = create<WorkspaceStore>()(
  (set, get, api) => ({
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