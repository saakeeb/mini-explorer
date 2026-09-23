"use client";

import { useMemo } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { WorkspaceNode } from "@/types/workspace";
import { collectAllDescendantIds } from "@/lib/tree";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

interface DeleteModalProps {
  node: WorkspaceNode;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteModal({ node, isOpen, onClose }: DeleteModalProps) {
  const deleteNode = useWorkspaceStore((state) => state.deleteNode);

  const descendantCount = useMemo(() => {
    if (node.type !== "folder") return 0;
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
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={handleDelete}
          className="cursor-pointer"
        >
          Delete {node.type === "folder" ? "Folder" : "File"}
        </Button>
      </div>
    </Modal>
  );
}
