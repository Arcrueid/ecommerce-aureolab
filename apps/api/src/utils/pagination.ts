/**
 * Creates pagination metadata
 */
export const createPaginationMeta = (
  page: number,
  perPage: number,
  total: number,
  offset: number
) => ({
  from: total > 0 ? offset + 1 : 0,
  to: Math.min(offset + perPage, total),
  records: total,
  page,
  per_page: perPage,
  total_pages: Math.ceil(total / perPage),
});
