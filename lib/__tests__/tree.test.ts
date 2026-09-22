import test from "node:test";
import assert from "node:assert/strict";
import {
  findNode,
  findParent,
  getAncestors,
  getBreadcrumbs,
  insertNode,
  renameNode,
  deleteNode,
  updateFileContent,
  collectAllDescendantIds,
} from "../tree";
import { INITIAL_WORKSPACE_SEED, ROOT_ID, WEBBLY_ID, NOTES_TXT_ID } from "../constants";
import { WorkspaceNode } from "../../types/workspace";
import { validateNodeName } from "../validators";
import { searchWorkspace } from "../search";

test("findNode finds existing nodes and returns null for missing", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const webbly = findNode(root, WEBBLY_ID);
  assert.ok(webbly);
  assert.equal(webbly?.name, "Webbly");

  const missing = findNode(root, "non-existent-id");
  assert.equal(missing, null);
});

test("findParent locates the correct parent folder", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const parentOfWebbly = findParent(root, WEBBLY_ID);
  assert.ok(parentOfWebbly);
  assert.equal(parentOfWebbly?.name, "Projects");

  const parentOfRoot = findParent(root, ROOT_ID);
  assert.equal(parentOfRoot, null);
});

test("getAncestors returns path from root to target", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const ancestors = getAncestors(root, NOTES_TXT_ID);
  const names = ancestors.map((n) => n.name);
  assert.deepEqual(names, ["Workspace", "Projects", "Webbly", "notes.txt"]);
});

test("getBreadcrumbs formats breadcrumb trail correctly", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const crumbs = getBreadcrumbs(root, WEBBLY_ID);
  assert.equal(crumbs.length, 3);
  assert.equal(crumbs[0].name, "Workspace");
  assert.equal(crumbs[0].isCurrent, false);
  assert.equal(crumbs[2].name, "Webbly");
  assert.equal(crumbs[2].isCurrent, true);
});

test("insertNode immutably adds a new item to the tree", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const newNode: WorkspaceNode = {
    id: "new-file-123",
    name: "design.css",
    type: "file",
    parentId: WEBBLY_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: "body { margin: 0; }",
  };

  const updated = insertNode(root, WEBBLY_ID, newNode);
  const webblyBefore = findNode(root, WEBBLY_ID);
  const webblyAfter = findNode(updated, WEBBLY_ID);

  assert.equal(webblyBefore?.children?.length, 2);
  assert.equal(webblyAfter?.children?.length, 3);
  assert.ok(webblyAfter?.children?.some((c) => c.name === "design.css"));
});

test("renameNode immutably updates the node name", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const updated = renameNode(root, NOTES_TXT_ID, "notes-v2.txt");

  const before = findNode(root, NOTES_TXT_ID);
  const after = findNode(updated, NOTES_TXT_ID);

  assert.equal(before?.name, "notes.txt");
  assert.equal(after?.name, "notes-v2.txt");
});

test("deleteNode immutably deletes target and all descendants", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const updated = deleteNode(root, WEBBLY_ID);

  const webbly = findNode(updated, WEBBLY_ID);
  const notes = findNode(updated, NOTES_TXT_ID);

  assert.equal(webbly, null);
  assert.equal(notes, null);
});

test("updateFileContent immutably modifies file content", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const updated = updateFileContent(root, NOTES_TXT_ID, "New content line 1");

  const file = findNode(updated, NOTES_TXT_ID);
  assert.equal(file?.content, "New content line 1");
});

test("collectAllDescendantIds gathers all descendant IDs", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const webbly = findNode(root, WEBBLY_ID)!;
  const ids = collectAllDescendantIds(webbly);
  assert.ok(ids.includes(WEBBLY_ID));
  assert.ok(ids.includes(NOTES_TXT_ID));
});

test("validateNodeName detects duplicates and invalid names", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const webbly = findNode(root, WEBBLY_ID)!;

  const empty = validateNodeName("   ", webbly);
  assert.equal(empty.isValid, false);

  const duplicate = validateNodeName("notes.txt", webbly);
  assert.equal(duplicate.isValid, false);

  const duplicateCase = validateNodeName("NOTES.TXT", webbly);
  assert.equal(duplicateCase.isValid, false);

  const valid = validateNodeName("changelog.txt", webbly);
  assert.equal(valid.isValid, true);
});

test("searchWorkspace searches recursively across nested folders and files", () => {
  const root = INITIAL_WORKSPACE_SEED;
  const txtResults = searchWorkspace(root, "txt");
  assert.equal(txtResults.length, 3); // notes.txt, tasks.txt, README.txt
  assert.ok(txtResults.some((r) => r.name === "notes.txt"));
  assert.ok(txtResults.some((r) => r.name === "tasks.txt"));
  assert.ok(txtResults.some((r) => r.name === "README.txt"));

  const webResults = searchWorkspace(root, "web");
  assert.equal(webResults.length, 1);
  assert.equal(webResults[0].name, "Webbly");
  assert.deepEqual(webResults[0].path, ["Workspace", "Projects", "Webbly"]);
});
