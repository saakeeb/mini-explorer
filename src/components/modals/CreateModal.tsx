"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { findNode } from "@/lib/tree";
import { validateNodeName } from "@/lib/validators";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface CreateModalProps {
  itemType: "folder" | "file";
  parentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateModal({
  itemType,
  parentId,
  isOpen,
  onClose,
}: CreateModalProps) {
  const root = useWorkspaceStore((state) => state.root);
  const createFolder = useWorkspaceStore((state) => state.createFolder);
  const createFile = useWorkspaceStore((state) => state.createFile);

  const parentFolder = useMemo(() => {
    return findNode(root, parentId);
  }, [root, parentId]);

  const [name, setName] = useState(
    itemType === "file" ? "untitled.txt" : "New Folder",
  );
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      if (itemType === "file") {
        inputRef.current.setSelectionRange(0, 8);
      } else {
        inputRef.current.select();
      }
    }
  }, [itemType]);

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
            className="block text-xs font-medium text-[#5C5F58] mb-1.5"
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
            placeholder={
              itemType === "folder" ? "e.g. Components" : "e.g. notes.txt"
            }
          />
          {error && <p className="mt-1.5 text-xs text-[#C24134]">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="cursor-pointer">
            Create {itemType === "folder" ? "Folder" : "File"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
