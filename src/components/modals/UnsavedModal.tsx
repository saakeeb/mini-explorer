"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface UnsavedModalProps {
  fileName: string;
  fileId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UnsavedModal({
  fileName,
  fileId,
  isOpen,
  onClose,
  onConfirm,
}: UnsavedModalProps) {
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
        <Button type="button" variant="secondary" onClick={onClose} className="cursor-pointer">
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={handleDiscardAndProceed}
          className="cursor-pointer"
        >
          Discard Changes
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSaveAndProceed}
          className="cursor-pointer"
        >
          Save & Continue
        </Button>
      </div>
    </Modal>
  );
}
