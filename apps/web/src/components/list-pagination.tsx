import { useMemo } from "react";

import { usePaginationSearchParams } from "~/hooks/use-pagination";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export const ListPagination = ({
  total,
  pageIndex,
  visiblePages = 4,
}: {
  total: number;
  pageIndex: number;
  visiblePages?: number;
}) => {
  const [, setParams] = usePaginationSearchParams();

  const pages = useMemo(() => {
    const maxPages = visiblePages;
    let startPage = 1;
    let endPage = Math.min(total, maxPages);

    if (total > maxPages && pageIndex > Math.ceil(maxPages / 2)) {
      startPage = Math.max(1, pageIndex - Math.floor(maxPages / 2));
      endPage = Math.min(total, startPage + maxPages - 1);

      if (endPage >= total) {
        startPage = Math.max(1, total - maxPages + 1);
        endPage = total;
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }, [visiblePages, total, pageIndex]);

  const showStartEllipsis = useMemo(() => pages[0] > 1, [pages]);
  const showEndEllipsis = useMemo(
    () => pages[pages.length - 1] < total,
    [pages, total],
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={pageIndex <= 1}
            className={pageIndex <= 1 ? "opacity-50" : ""}
            onClick={() => setParams({ pageIndex: Math.max(1, pageIndex - 1) })}
          />
        </PaginationItem>

        {showStartEllipsis && (
          <PaginationItem>
            <PaginationLink onClick={() => setParams({ pageIndex: 1 })}>
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {showStartEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setParams({ pageIndex: page })}
              isActive={pageIndex === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEndEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {showEndEllipsis && (
          <PaginationItem>
            <PaginationLink onClick={() => setParams({ pageIndex: total })}>
              {total}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            disabled={pageIndex >= total}
            className={pageIndex >= total ? "opacity-50" : ""}
            onClick={() =>
              setParams({ pageIndex: Math.min(total, pageIndex + 1) })
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
