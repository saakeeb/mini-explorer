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

export interface SearchResult {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  path: string[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  isCurrent: boolean;
}

export type ActiveDialog =
  | { type: "create"; itemType: NodeType; parentId: string }
  | { type: "rename"; node: WorkspaceNode }
  | { type: "delete"; node: WorkspaceNode }
  | {
      type: "unsaved";
      fileId: string;
      fileName: string;
      onConfirm: () => void;
    }
  | null;

export interface ToastMessage {
  id: string;
  message: string;
  type?: "info" | "success" | "warning" | "danger";
}
