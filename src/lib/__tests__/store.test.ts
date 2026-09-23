import test from "node:test";
import assert from "node:assert/strict";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { ROOT_ID, WEBBLY_ID, NOTES_TXT_ID } from "../constants";
import { findNode } from "../tree";

test("store state initializes with seed data", () => {
  const state = useWorkspaceStore.getState();
  assert.ok(state.root);
  assert.equal(state.root.id, ROOT_ID);
  assert.equal(state.selectedFolderId, ROOT_ID);
  assert.equal(state.selectedFileId, null);
});

test("createFolder adds a folder and selects parent", () => {
  const store = useWorkspaceStore.getState();
  const created = store.createFolder(WEBBLY_ID, "assets");
  assert.equal(created, true);

  const updatedState = useWorkspaceStore.getState();
  const webbly = findNode(updatedState.root, WEBBLY_ID);
  const assets = webbly?.children?.find((c) => c.name === "assets");
  assert.ok(assets);
  assert.equal(assets?.type, "folder");
  assert.equal(assets?.parentId, WEBBLY_ID);
});

test("createFile adds a file and opens it in editor", () => {
  const store = useWorkspaceStore.getState();
  const created = store.createFile(WEBBLY_ID, "styles.css", "body { color: red; }");
  assert.equal(created, true);

  const updatedState = useWorkspaceStore.getState();
  const webbly = findNode(updatedState.root, WEBBLY_ID);
  const file = webbly?.children?.find((c) => c.name === "styles.css");
  assert.ok(file);
  assert.equal(file?.type, "file");
  assert.equal(updatedState.selectedFileId, file?.id);
});

test("updateDraftContent and saveFile flow", () => {
  const store = useWorkspaceStore.getState();
  store.updateDraftContent(NOTES_TXT_ID, "Updated draft content for test");

  let state = useWorkspaceStore.getState();
  assert.ok(state.dirtyFiles.has(NOTES_TXT_ID));
  assert.equal(state.draftContents[NOTES_TXT_ID], "Updated draft content for test");

  // Save the file
  store.saveFile(NOTES_TXT_ID);
  state = useWorkspaceStore.getState();
  assert.equal(state.dirtyFiles.has(NOTES_TXT_ID), false);

  const updatedFile = findNode(state.root, NOTES_TXT_ID);
  assert.equal(updatedFile?.content, "Updated draft content for test");
});

test("deleteNode cascades and resets selection if active node deleted", () => {
  const store = useWorkspaceStore.getState();
  store.selectFile(NOTES_TXT_ID);
  assert.equal(useWorkspaceStore.getState().selectedFileId, NOTES_TXT_ID);

  // Delete notes.txt
  store.deleteNode(NOTES_TXT_ID);
  const state = useWorkspaceStore.getState();
  assert.equal(state.selectedFileId, null);
  assert.equal(findNode(state.root, NOTES_TXT_ID), null);
});

test("resetToSeed restores initial tree", () => {
  const store = useWorkspaceStore.getState();
  store.resetToSeed();
  const state = useWorkspaceStore.getState();
  assert.equal(state.selectedFolderId, ROOT_ID);
  assert.equal(state.selectedFileId, null);
  const notes = findNode(state.root, NOTES_TXT_ID);
  assert.ok(notes);
});
