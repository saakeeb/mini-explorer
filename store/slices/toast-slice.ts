import { generateId } from "@/lib/ids";
import { ToastActions, WorkspaceSlice } from "../types";

export const createToastSlice: WorkspaceSlice<
    ToastActions
> = (set, get) => ({
    addToast: (message, type = "info") => {
        const id = generateId();

        set((state) => ({
            toasts: [
                ...state.toasts,
                { id, message, type },
            ],
        }));

        setTimeout(() => {
            get().removeToast(id);
        }, 3200);
    },

    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
});