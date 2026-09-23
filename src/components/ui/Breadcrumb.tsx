"use client";

import * as React from "react";
import { ChevronRight, Folder } from "lucide-react";
import { useWorkspace } from "@/src/hooks/useWorkspace";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { findNode } from "@/src/lib/tree";

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
                <span className="text-[#8B8F86] select-none">
                  /
                </span>
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-[#1C1D1A] px-1.5 py-0.5 rounded-[4px] bg-[#F2F3F1]"
                >
                  {item.name}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClick(item.id, false)}
                  className="text-[#5C5F58] hover:text-[#0F5C4B] hover:underline decoration-1 underline-offset-4 cursor-pointer transition-colors px-1 py-0.5 rounded-[4px]"
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
