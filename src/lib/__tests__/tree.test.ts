import { describe, it, expect } from "vitest";
import {
  findNode,
  findParent,
  insertNode,
  renameNode,
  deleteNode,
  updateFileContent,
} from "../tree";
import { INITIAL_WORKSPACE_SEED, ROOT_ID, WEBBLY_ID, NOTES_TXT_ID } from "../constants";
import { WorkspaceNode } from "@/types/workspace";
import { searchWorkspace } from "../search";

describe("Workspace Tree Utilities", () => {
  it("findNode finds existing nodes and returns null for missing", () => {
    const root = INITIAL_WORKSPACE_SEED;
    const webbly = findNode(root, WEBBLY_ID);
    expect(webbly).toBeDefined();
    expect(webbly?.name).toBe("Webbly");

    const missing = findNode(root, "non-existent-id");
    expect(missing).toBeNull();
  });

  it("findParent locates the correct parent folder", () => {
    const root = INITIAL_WORKSPACE_SEED;
    const parentOfWebbly = findParent(root, WEBBLY_ID);
    expect(parentOfWebbly).toBeDefined();
    expect(parentOfWebbly?.name).toBe("Projects");

    const parentOfRoot = findParent(root, ROOT_ID);
    expect(parentOfRoot).toBeNull();
  });

  it("insertNode immutably adds a new item to the tree", () => {
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

    expect(webblyBefore?.children).toHaveLength(2);
    expect(webblyAfter?.children).toHaveLength(3);
    expect(webblyAfter?.children?.some((c) => c.name === "design.css")).toBe(true);
  });

  it("renameNode immutably updates the node name", () => {
    const root = INITIAL_WORKSPACE_SEED;
    const updated = renameNode(root, NOTES_TXT_ID, "notes-v2.txt");

    const before = findNode(root, NOTES_TXT_ID);
    const after = findNode(updated, NOTES_TXT_ID);

    expect(before?.name).toBe("notes.txt");
    expect(after?.name).toBe("notes-v2.txt");
  });

  it("deleteNode immutably deletes target and all descendants", () => {
    const root = INITIAL_WORKSPACE_SEED;
    const updated = deleteNode(root, WEBBLY_ID);

    const webbly = findNode(updated, WEBBLY_ID);
    const notes = findNode(updated, NOTES_TXT_ID);

    expect(webbly).toBeNull();
    expect(notes).toBeNull();
  });

  it("updateFileContent immutably modifies file content", () => {
    const root = INITIAL_WORKSPACE_SEED;
    const updated = updateFileContent(root, NOTES_TXT_ID, "New content line 1");

    const file = findNode(updated, NOTES_TXT_ID);
    expect(file?.content).toBe("New content line 1");
  });

  it("searchWorkspace searches recursively across nested folders and files", () => {
    const root = INITIAL_WORKSPACE_SEED;
    const txtResults = searchWorkspace(root, "txt");
    expect(txtResults).toHaveLength(3);
    expect(txtResults.some((r) => r.name === "notes.txt")).toBe(true);
    expect(txtResults.some((r) => r.name === "tasks.txt")).toBe(true);
    expect(txtResults.some((r) => r.name === "README.txt")).toBe(true);

    const webResults = searchWorkspace(root, "web");
    expect(webResults).toHaveLength(1);
    expect(webResults[0].name).toBe("Webbly");
    expect(webResults[0].path).toEqual(["Workspace", "Projects", "Webbly"]);
  });
});
