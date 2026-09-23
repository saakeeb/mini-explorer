import { WorkspaceNode } from "@/src/types/workspace";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validates a proposed node name within a target parent folder

export function validateNodeName(
  proposedName: string,
  parentFolder: WorkspaceNode,
  currentExcludedNodeId?: string
): ValidationResult {
  const trimmed = proposedName.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "Name cannot be empty.",
    };
  }

  if (trimmed.length > 255) {
    return {
      isValid: false,
      error: "Name cannot exceed 255 characters.",
    };
  }

  // Check forbidden characters
  const forbiddenRegex = /[\\/:*?"<>|]/;
  if (forbiddenRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Name cannot contain characters: / \\ : * ? " < > |',
    };
  }

  if (parentFolder.children) {
    const isDuplicate = parentFolder.children.some((child) => {
      if (currentExcludedNodeId && child.id === currentExcludedNodeId) {
        return false;
      }
      return child.name.toLowerCase() === trimmed.toLowerCase();
    });

    if (isDuplicate) {
      return {
        isValid: false,
        error: `An item named "${trimmed}" already exists in this folder.`,
      };
    }
  }

  return { isValid: true };
}
