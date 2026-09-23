import { WorkspaceNode } from "@/src/types/workspace";

export const STORAGE_KEY = "workspace-explorer:v1";

export const ROOT_ID = "root-workspace-001";
export const PROJECTS_ID = "projects-folder-002";
export const WEBBLY_ID = "webbly-folder-003";
export const PERSONAL_ID = "personal-folder-004";
export const DOCUMENTS_ID = "documents-folder-005";

export const NOTES_TXT_ID = "notes-file-006";
export const TASKS_TXT_ID = "tasks-file-007";
export const README_TXT_ID = "readme-file-008";

const timestamp = "2026-09-22T00:00:00.000Z";

export const INITIAL_WORKSPACE_SEED: WorkspaceNode = {
  id: ROOT_ID,
  name: "Workspace",
  type: "folder",
  parentId: null,
  createdAt: timestamp,
  updatedAt: timestamp,
  children: [
    {
      id: PROJECTS_ID,
      name: "Projects",
      type: "folder",
      parentId: ROOT_ID,
      createdAt: timestamp,
      updatedAt: timestamp,
      children: [
        {
          id: WEBBLY_ID,
          name: "Webbly",
          type: "folder",
          parentId: PROJECTS_ID,
          createdAt: timestamp,
          updatedAt: timestamp,
          children: [
            {
              id: NOTES_TXT_ID,
              name: "notes.txt",
              type: "file",
              parentId: WEBBLY_ID,
              createdAt: timestamp,
              updatedAt: timestamp,
              content:
                "Webbly Architecture Notes\n=========================\n\n1. Built with Next.js App Router and React 19.\n2. State is strictly managed via Zustand with pure tree algorithms.\n3. Zero layout shift, full keyboard accessibility, and offline persistence.\n4. Design adheres to Swiss Editorial and Desktop Native principles.",
            },
            {
              id: TASKS_TXT_ID,
              name: "tasks.txt",
              type: "file",
              parentId: WEBBLY_ID,
              createdAt: timestamp,
              updatedAt: timestamp,
              content:
                "- [x] Implement recursive tree structure\n- [x] Configure design tokens & typography\n- [x] Build keyboard-accessible navigation\n- [x] Add real-time search across nested hierarchy\n- [x] Support seamless local persistence",
            },
          ],
        },
        {
          id: PERSONAL_ID,
          name: "Personal",
          type: "folder",
          parentId: PROJECTS_ID,
          createdAt: timestamp,
          updatedAt: timestamp,
          children: [],
        },
      ],
    },
    {
      id: DOCUMENTS_ID,
      name: "Documents",
      type: "folder",
      parentId: ROOT_ID,
      createdAt: timestamp,
      updatedAt: timestamp,
      children: [],
    },
    {
      id: README_TXT_ID,
      name: "README.txt",
      type: "file",
      parentId: ROOT_ID,
      createdAt: timestamp,
      updatedAt: timestamp,
      content:
        "Mini Workspace Explorer\n=======================\n\nWelcome to your browser-based file manager!\n\nShortcuts:\n- Ctrl/Cmd + K: Focus Search\n- Ctrl/Cmd + S: Save active file\n- Enter: Open item\n- Esc: Close dialog / search\n\nYou can create folders and text files, rename them, edit file contents, and search through deeply nested structures.",
    },
  ],
};
