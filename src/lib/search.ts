import { SearchResult, WorkspaceNode } from "@/types/workspace";

export function searchWorkspace(
  root: WorkspaceNode,
  query: string,
): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return [];
  }

  const results: SearchResult[] = [];

  function traverse(node: WorkspaceNode, currentPath: string[]) {
    if (node.parentId !== null && node.name.toLowerCase().includes(trimmed)) {
      results.push({
        id: node.id,
        name: node.name,
        type: node.type,
        parentId: node.parentId,
        path: [...currentPath, node.name],
      });
    }

    if (node.children && node.children.length > 0) {
      const nextPath = [...currentPath, node.name];
      for (const child of node.children) {
        traverse(child, nextPath);
      }
    }
  }

  traverse(root, []);

  return results.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}
