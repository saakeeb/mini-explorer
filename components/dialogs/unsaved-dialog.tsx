"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/store/workspace-store";

interface UnsavedDialogProps {
  fileName: string;
  fileId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UnsavedDialog({
  fileName,
  fileId,
  isOpen,
  onClose,
  onConfirm,
}: UnsavedDialogProps) {
  const saveFile = useWorkspaceStore((state) => state.saveFile);
  const discardFileChanges = useWorkspaceStore(
    (state) => state.discardFileChanges
  );

  const handleSaveAndProceed = () => {
    saveFile(fileId);
    onClose();
    onConfirm();
  };

  const handleDiscardAndProceed = () => {
    discardFileChanges(fileId);
    onClose();
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unsaved Changes"
      description={`You have unsaved changes in "${fileName}". If you leave without saving, your edits will be discarded.`}
    >
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={handleDiscardAndProceed}
        >
          Discard Changes
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSaveAndProceed}
        >
          Save & Continue
        </Button>
      </div>
    </Modal>
  );
}
