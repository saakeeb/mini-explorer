"use client";

import { useMemo } from "react";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { searchWorkspace } from "@/src/lib/search";

export function useSearch() {
  const root = useWorkspaceStore((state) => state.root);
  const searchQuery = useWorkspaceStore((state) => state.searchQuery);
  const isSearchOpen = useWorkspaceStore((state) => state.isSearchOpen);
  const setSearchQuery = useWorkspaceStore((state) => state.setSearchQuery);
  const setIsSearchOpen = useWorkspaceStore((state) => state.setIsSearchOpen);
  const navigateToItem = useWorkspaceStore((state) => state.navigateToItem);

  const results = useMemo(() => {
    return searchWorkspace(root, searchQuery);
  }, [root, searchQuery]);

  const folderResults = useMemo(
    () => results.filter((r) => r.type === "folder"),
    [results]
  );

  const fileResults = useMemo(
    () => results.filter((r) => r.type === "file"),
    [results]
  );

  return {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    results,
    folderResults,
    fileResults,
    navigateToItem,
  };
}
