"use client";

import * as React from "react";
import { ChevronRight, Folder } from "lucide-react";
import { useWorkspace } from "@/hooks/use-workspace";
import { useWorkspaceStore } from "@/store/workspace-store";
import { findNode } from "@/lib/tree";

export function Breadcrumb() {
  const { breadcrumbs, root } = useWorkspace();
  const selectFolder = useWorkspaceStore((state) => state.selectFolder);
  const selectFile = useWorkspaceStore((state) => state.selectFile);

  const handleClick = (id: string, isCurrent: boolean) => {
    if (isCurrent) return;
    const node = findNode(root, id);
    if (!node) return;

    if (node.type === "folder") {
      selectFolder(node.id);
    } else {
      selectFile(node.id);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-1 scrollbar-none text-xs"
    >
      <div className="flex items-center gap-1.5">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <React.Fragment key={item.id}>
              {index > 0 && (
                <span className="text-[var(--text-tertiary)] select-none">
                  /
                </span>
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-[var(--text-primary)] px-1.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-secondary)]"
                >
                  {item.name}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClick(item.id, false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--primary)] hover:underline decoration-1 underline-offset-4 cursor-pointer transition-colors px-1 py-0.5 rounded-[var(--radius-xs)]"
                >
                  {item.name}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
