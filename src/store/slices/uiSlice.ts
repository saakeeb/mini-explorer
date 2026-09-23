import { UIActions, WorkspaceSlice } from "../types";

export const createUISlice: WorkspaceSlice<UIActions> = (
    set
) => ({
    openDialog: (dialog) =>
        set({ activeDialog: dialog }),

    closeDialog: () =>
        set({ activeDialog: null }),
});