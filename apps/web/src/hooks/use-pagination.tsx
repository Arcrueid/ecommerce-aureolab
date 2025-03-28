import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { PAGE_SIZE } from "~/lib/constants";

const paginationParsers = {
  pageIndex: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger
    .withDefault(PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
  orderBy: parseAsString.withOptions({ clearOnDefault: true }),
  order: parseAsString.withOptions({ clearOnDefault: true }),
  search: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true, throttleMs: 600 }),
};
const paginationUrlKeys = {
  pageIndex: "page",
  pageSize: "per_page",
  orderBy: "order_by",
  order: "order",
  search: "search",
};

export function usePaginationSearchParams() {
  return useQueryStates(paginationParsers, {
    shallow: true,
    urlKeys: paginationUrlKeys,
  });
}
