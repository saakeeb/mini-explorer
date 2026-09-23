# Mini Workspace Explorer

Mini Workspace Explorer, a browser-based file manager where users can create, navigate, search, edit, rename, and delete folders and text files.

---

## How to run the project

Make sure you have Node.js (version 22 or newer) and pnpm installed on your computer.

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the local development server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### 3. Run the automated tests

```bash
pnpm run test
```

### 4. Create a production build

```bash
pnpm run build
```

---

## Project structure

All application source code lives inside the `src` folder:

```text
src/
├── app/
├── components/
│   ├── layout/
│   ├── explorer/
│   ├── editor/
│   ├── modals/
│   └── ui/
├── store/
│   ├── slices/
│   ├── types.ts
│   └── workspaceStore.ts
├── hooks/
├── lib/
└── types/
```

---

## State management approach

I have use Zustand to manage state.

- **Split into slices**: Put everything state differently to make it readable.
- **Draft edits before saving**: When user type in the text editor, text is held in a temporary draft state.

---

## File-system data structure

The entire workspace is modeled as a recursive tree. Each item in the tree is a `WorkspaceNode`:

```ts
export type NodeType = "folder" | "file";

export interface WorkspaceNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  children?: WorkspaceNode[];
  content?: string;
  createdAt: string;
  updatedAt: string;
}
```

- **Folders** have an array of `children`.
- **Files** have a `content` string and no children.
- **The Root folder** sits at the top level with `parentId: null`.

---

## Important implementation decisions

- **Pure immutable tree updates**: Whenever user add, rename, or delete something, I try not to change the original tree. Instead, I return a brand new tree object.
- **No duplicate names in the same folder**: User cannot create or rename a file or folder to a name that already exists in that same directory.
- **Unsaved changes guard**: If any user edit a file and try to switch to another file or folder, a modal appears if they want to save or discard their changes first.
- **Safe cascading deletes**: When user delete a folder, it deletes everything inside it.
- **Local storage persistence**: The tree is saved to your browser local storage.
