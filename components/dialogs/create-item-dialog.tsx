"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceStore } from "@/store/workspace-store";
import { findNode } from "@/lib/tree";
import { validateNodeName } from "@/lib/validators";

interface CreateItemDialogProps {
  itemType: "folder" | "file";
  parentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateItemDialog({
  itemType,
  parentId,
  isOpen,
  onClose,
}: CreateItemDialogProps) {
  const root = useWorkspaceStore((state) => state.root);
  const createFolder = useWorkspaceStore((state) => state.createFolder);
  const createFile = useWorkspaceStore((state) => state.createFile);

  const parentFolder = React.useMemo(() => {
    return findNode(root, parentId);
  }, [root, parentId]);

  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setName(itemType === "file" ? "untitled.txt" : "New Folder");
      setError(null);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Select base name without extension for files
          if (itemType === "file") {
            inputRef.current.setSelectionRange(0, 8);
          } else {
            inputRef.current.select();
          }
        }
      }, 50);
    }
  }, [isOpen, itemType]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!parentFolder) return;

    const validation = validateNodeName(name, parentFolder);
    if (!validation.isValid) {
      setError(validation.error || "Invalid name.");
      return;
    }

    if (itemType === "folder") {
      const success = createFolder(parentId, name);
      if (success) onClose();
    } else {
      const success = createFile(parentId, name);
      if (success) onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemType === "folder" ? "New Folder" : "New Text File"}
      description={`Creating inside "${parentFolder?.name || "Workspace"}"`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="item-name-input"
            className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
          >
            {itemType === "folder" ? "Folder Name" : "File Name"}
          </label>
          <Input
            id="item-name-input"
            ref={inputRef}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            error={!!error}
            placeholder={itemType === "folder" ? "e.g. Components" : "e.g. notes.txt"}
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
            Create {itemType === "folder" ? "Folder" : "File"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
