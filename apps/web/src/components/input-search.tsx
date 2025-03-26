import { useCallback, useState } from "react";

import { useLocation, useNavigate } from "@tanstack/react-router";
import { SearchIcon, XIcon } from "lucide-react";

import { Input } from "~/components/ui/input";
import { usePaginationSearchParams } from "~/hooks/use-pagination";
import { cn } from "~/lib/utils";

export const InputSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const isProductPage = pathname === "/productos";
  const disableSearch = ["/checkout"].includes(pathname);
  const [, setSearchParams] = usePaginationSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);

      if (isProductPage) {
        setSearchParams({ search: e.target.value });
      }
    },
    [isProductPage, setSearchParams],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (isProductPage) {
        setSearchParams({ search: query });
      } else {
        navigate({
          to: "/productos",
          search: { search: query },
        });
      }
    },
    [isProductPage, setSearchParams, query, navigate],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setSearchParams({ search: "" });
  }, [setSearchParams]);

  return (
    <div className={cn("relative w-full")}>
      <form onSubmit={handleSubmit}>
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={handleChange}
          className="h-9 w-full !rounded-full pr-9 pl-9 !ring-0"
          disabled={disableSearch}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
};
