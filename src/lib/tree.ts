import { BreadcrumbItem, WorkspaceNode } from "@/types/workspace";

export function findNode(
  root: WorkspaceNode,
  id: string
): WorkspaceNode | null {
  if (root.id === id) {
    return root;
  }
  if (root.children && root.children.length > 0) {
    for (const child of root.children) {
      const match = findNode(child, id);
      if (match) {
        return match;
      }
    }
  }
  return null;
}

export function findParent(
  root: WorkspaceNode,
  id: string
): WorkspaceNode | null {
  if (root.id === id || !root.children) {
    return null;
  }
  for (const child of root.children) {
    if (child.id === id) {
      return root;
    }
    const found = findParent(child, id);
    if (found) {
      return found;
    }
  }
  return null;
}

export function getAncestors(
  root: WorkspaceNode,
  id: string
): WorkspaceNode[] {
  const path: WorkspaceNode[] = [];

  function traverse(current: WorkspaceNode): boolean {
    path.push(current);
    if (current.id === id) {
      return true;
    }
    if (current.children) {
      for (const child of current.children) {
        if (traverse(child)) {
          return true;
        }
      }
    }
    path.pop();
    return false;
  }

  traverse(root);
  return path;
}

export function getBreadcrumbs(
  root: WorkspaceNode,
  id: string
): BreadcrumbItem[] {
  const ancestors = getAncestors(root, id);
  return ancestors.map((node, index) => ({
    id: node.id,
    name: node.name,
    isCurrent: index === ancestors.length - 1,
  }));
}

export function insertNode(
  root: WorkspaceNode,
  parentId: string,
  node: WorkspaceNode
): WorkspaceNode {
  if (root.id === parentId) {
    if (root.type !== "folder") {
      throw new Error(`Cannot add child to non-folder node: ${root.name}`);
    }
    const existingChildren = root.children ?? [];
    return {
      ...root,
      updatedAt: new Date().toISOString(),
      children: [...existingChildren, { ...node, parentId: root.id }],
    };
  }

  if (!root.children || root.children.length === 0) {
    return root;
  }

  return {
    ...root,
    children: root.children.map((child) =>
      insertNode(child, parentId, node)
    ),
  };
}

export function renameNode(
  root: WorkspaceNode,
  id: string,
  newName: string
): WorkspaceNode {
  if (root.id === id) {
    return {
      ...root,
      name: newName,
      updatedAt: new Date().toISOString(),
    };
  }

  if (!root.children || root.children.length === 0) {
    return root;
  }

  return {
    ...root,
    children: root.children.map((child) => renameNode(child, id, newName)),
  };
}

export function deleteNode(
  root: WorkspaceNode,
  id: string
): WorkspaceNode {
  if (root.id === id) {
    // Root node deletion is not allowed
    return root;
  }

  if (!root.children || root.children.length === 0) {
    return root;
  }

  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== id)
      .map((child) => deleteNode(child, id)),
  };
}

export function updateFileContent(
  root: WorkspaceNode,
  id: string,
  content: string
): WorkspaceNode {
  if (root.id === id) {
    if (root.type !== "file") {
      throw new Error(`Node ${id} is a folder, cannot update text content.`);
    }
    return {
      ...root,
      content,
      updatedAt: new Date().toISOString(),
    };
  }

  if (!root.children || root.children.length === 0) {
    return root;
  }

  return {
    ...root,
    children: root.children.map((child) =>
      updateFileContent(child, id, content)
    ),
  };
}

export function collectAllDescendantIds(node: WorkspaceNode): string[] {
  const ids: string[] = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...collectAllDescendantIds(child));
    }
  }
  return ids;
}
