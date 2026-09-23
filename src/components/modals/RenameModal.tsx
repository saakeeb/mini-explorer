"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { WorkspaceNode } from "@/src/types/workspace";
import { findParent } from "@/src/lib/tree";
import { validateNodeName } from "@/src/lib/validators";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface RenameModalProps {
  node: WorkspaceNode;
  isOpen: boolean;
  onClose: () => void;
}

export function RenameModal({ node, isOpen, onClose }: RenameModalProps) {
  const root = useWorkspaceStore((state) => state.root);
  const renameNode = useWorkspaceStore((state) => state.renameNode);

  const parentFolder = useMemo(() => {
    return findParent(root, node.id);
  }, [root, node.id]);

  const [name, setName] = useState(node.name);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
            className="block text-xs font-medium text-[#5C5F58] mb-1.5"
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
            <p className="mt-1.5 text-xs text-[#C24134]">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="cursor-pointer">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
