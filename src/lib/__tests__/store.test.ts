import { describe, it, expect, beforeEach } from "vitest";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { WEBBLY_ID, NOTES_TXT_ID } from "../constants";
import { findNode } from "../tree";

describe("Workspace Store", () => {
  beforeEach(() => {
    useWorkspaceStore.getState().resetToSeed();
  });

  it("createFolder adds a folder and selects parent", () => {
    const store = useWorkspaceStore.getState();
    const created = store.createFolder(WEBBLY_ID, "assets");
    expect(created).toBe(true);

    const updatedState = useWorkspaceStore.getState();
    const webbly = findNode(updatedState.root, WEBBLY_ID);
    const assets = webbly?.children?.find((c) => c.name === "assets");
    expect(assets).toBeDefined();
    expect(assets?.type).toBe("folder");
    expect(assets?.parentId).toBe(WEBBLY_ID);
  });

  it("createFile adds a file and opens it in editor", () => {
    const store = useWorkspaceStore.getState();
    const created = store.createFile(WEBBLY_ID, "styles.css", "body { color: red; }");
    expect(created).toBe(true);

    const updatedState = useWorkspaceStore.getState();
    const webbly = findNode(updatedState.root, WEBBLY_ID);
    const file = webbly?.children?.find((c) => c.name === "styles.css");
    expect(file).toBeDefined();
    expect(file?.type).toBe("file");
    expect(updatedState.selectedFileId).toBe(file?.id);
  });

  it("updateDraftContent and saveFile flow", () => {
    const store = useWorkspaceStore.getState();
    store.updateDraftContent(NOTES_TXT_ID, "Updated draft content for test");

    let state = useWorkspaceStore.getState();
    expect(state.dirtyFiles.has(NOTES_TXT_ID)).toBe(true);
    expect(state.draftContents[NOTES_TXT_ID]).toBe("Updated draft content for test");

    store.saveFile(NOTES_TXT_ID);
    state = useWorkspaceStore.getState();
    expect(state.dirtyFiles.has(NOTES_TXT_ID)).toBe(false);

    const updatedFile = findNode(state.root, NOTES_TXT_ID);
    expect(updatedFile?.content).toBe("Updated draft content for test");
  });

  it("deleteNode cascades and resets selection if active node deleted", () => {
    const store = useWorkspaceStore.getState();
    store.selectFile(NOTES_TXT_ID);
    expect(useWorkspaceStore.getState().selectedFileId).toBe(NOTES_TXT_ID);

    store.deleteNode(NOTES_TXT_ID);
    const state = useWorkspaceStore.getState();
    expect(state.selectedFileId).toBeNull();
    expect(findNode(state.root, NOTES_TXT_ID)).toBeNull();
  });
});
