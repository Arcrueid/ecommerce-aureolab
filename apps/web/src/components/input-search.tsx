import { SearchIcon, XIcon } from "lucide-react";

import { Input } from "~/components/ui/input";
import { usePaginationSearchParams } from "~/hooks/use-pagination";

export const InputSearch = () => {
  const [params, setSearchParams] = usePaginationSearchParams();

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Buscar productos..."
        value={params.search || ""}
        onChange={(e) =>
          setSearchParams({ search: e.target.value }, { throttleMs: 500 })
        }
        className="h-9 w-full !rounded-full pr-9 pl-9 !ring-0"
      />
      {params.search && (
        <button
          type="button"
          onClick={() => setSearchParams({ search: "" })}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
