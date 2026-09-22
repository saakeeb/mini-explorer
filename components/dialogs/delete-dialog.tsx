"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/store/workspace-store";
import { WorkspaceNode } from "@/types/workspace";
import { collectAllDescendantIds } from "@/lib/tree";

interface DeleteDialogProps {
  node: WorkspaceNode;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteDialog({ node, isOpen, onClose }: DeleteDialogProps) {
  const deleteNode = useWorkspaceStore((state) => state.deleteNode);

  const descendantCount = React.useMemo(() => {
    if (node.type !== "folder") return 0;
    // Count items excluding the folder itself
    return collectAllDescendantIds(node).length - 1;
  }, [node]);

  const handleDelete = () => {
    deleteNode(node.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={node.type === "folder" ? "Delete Folder?" : "Delete File?"}
      description={
        node.type === "folder" && descendantCount > 0
          ? `This will permanently delete "${node.name}" and all ${descendantCount} item${
              descendantCount === 1 ? "" : "s"
            } inside it.`
          : `Are you sure you want to delete "${node.name}"? This action cannot be undone.`
      }
    >
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={handleDelete}>
          Delete {node.type === "folder" ? "Folder" : "File"}
        </Button>
      </div>
    </Modal>
  );
}
