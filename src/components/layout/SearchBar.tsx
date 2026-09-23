"use client";

import { useEffect, useRef } from "react";
import { Search, X, Folder, FileText } from "lucide-react";
import { useSearch } from "@/src/hooks/useSearch";

export function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    folderResults,
    fileResults,
    results,
    navigateToItem,
  } = useSearch();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSearchOpen]);

  const handleSelect = (id: string) => {
    navigateToItem(id);
    setIsSearchOpen(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.trim().toLowerCase() ? (
            <mark
              key={i}
              className="bg-[#0F5C4B]/10 text-[#0F5C4B] font-semibold rounded-xs px-0.5"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#8B8F86] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isSearchOpen) setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="Search workspace..."
          className="w-full h-8 pl-8 pr-16 text-xs bg-[#F2F3F1] hover:bg-[#FFFFFF] focus:bg-[#FFFFFF] text-[#1C1D1A] placeholder:text-[#8B8F86] border border-[#DFE2DB] focus:border-[#0F5C4B] rounded-[8px] transition-colors focus-visible:outline-none"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="p-0.5 rounded text-[#8B8F86] hover:text-[#1C1D1A] cursor-pointer"
            >
              <X className="w-3 h-3 cursor-pointer" />
            </button>
          ) : ''}
        </div>
      </div>

      {/* Results Dropdown */}
      {isSearchOpen && searchQuery.trim() && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#FFFFFF] border border-[#DFE2DB] rounded-[12px] shadow-[var(--shadow-modal)] max-h-80 overflow-y-auto p-1.5 text-xs">
          {results.length === 0 ? (
            <div className="py-6 text-center text-[#5C5F58]">
              <p className="font-medium">No results found</p>
              <p className="mt-1 text-[11px] text-[#8B8F86]">
                No files or folders matching &quot;{searchQuery}&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Folders group */}
              {folderResults.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-semibold text-[#8B8F86] uppercase tracking-wider">
                    Folders ({folderResults.length})
                  </div>
                  <div className="space-y-0.5">
                    {folderResults.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => handleSelect(res.id)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] hover:bg-[#F2F3F1] text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Folder className="w-3.5 h-3.5 text-[#C98A2E] shrink-0" />
                          <span className="truncate font-medium text-[#1C1D1A]">
                            {highlightMatch(res.name, searchQuery)}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8B8F86] truncate ml-2 font-mono group-hover:text-[#5C5F58]">
                          {res.path.slice(0, -1).join(" / ")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files group */}
              {fileResults.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-semibold text-[#8B8F86] uppercase tracking-wider">
                    Files ({fileResults.length})
                  </div>
                  <div className="space-y-0.5">
                    {fileResults.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => handleSelect(res.id)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] hover:bg-[#F2F3F1] text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-[#5C5F58] shrink-0" />
                          <span className="truncate text-[#1C1D1A]">
                            {highlightMatch(res.name, searchQuery)}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8B8F86] truncate ml-2 font-mono group-hover:text-[#5C5F58]">
                          {res.path.slice(0, -1).join(" / ")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
