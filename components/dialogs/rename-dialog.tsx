"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceStore } from "@/store/workspace-store";
import { WorkspaceNode } from "@/types/workspace";
import { findParent } from "@/lib/tree";
import { validateNodeName } from "@/lib/validators";

interface RenameDialogProps {
  node: WorkspaceNode;
  isOpen: boolean;
  onClose: () => void;
}

export function RenameDialog({ node, isOpen, onClose }: RenameDialogProps) {
  const root = useWorkspaceStore((state) => state.root);
  const renameNode = useWorkspaceStore((state) => state.renameNode);

  const parentFolder = React.useMemo(() => {
    return findParent(root, node.id);
  }, [root, node.id]);

  const [name, setName] = React.useState(node.name);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setName(node.name);
      setError(null);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const dotIndex = node.name.lastIndexOf(".");
          if (node.type === "file" && dotIndex > 0) {
            inputRef.current.setSelectionRange(0, dotIndex);
          } else {
            inputRef.current.select();
          }
        }
      }, 50);
    }
  }, [isOpen, node]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!parentFolder) return;

    if (name.trim() === node.name) {
      onClose();
      return;
    }

    const validation = validateNodeName(name, parentFolder, node.id);
    if (!validation.isValid) {
      setError(validation.error || "Invalid name.");
      return;
    }

    const success = renameNode(node.id, name);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={node.type === "folder" ? "Rename Folder" : "Rename File"}
      description={`Renaming "${node.name}"`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="rename-item-input"
            className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
          >
            New Name
          </label>
          <Input
            id="rename-item-input"
            ref={inputRef}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            error={!!error}
          />
          {error && (
            <p className="mt-1.5 text-xs text-[var(--danger)]">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
