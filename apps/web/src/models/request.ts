import { z } from "zod";

export const PaginateRequest = z.object({
  page: z.coerce.number().nullish(),
  per_page: z.coerce.number().nullish(),
  order: z.enum(["asc", "desc"]).nullish(),
  order_by: z.string().nullish(),
  search: z.string().nullish(),
});

const PaginateMeta = z.object({
  from: z.number(),
  to: z.number(),
  records: z.number(),
  page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
});

type PaginateMeta = z.infer<typeof PaginateMeta>;

export type PaginateRequest = z.infer<typeof PaginateRequest>;

export type PaginateResponse<T> = {
  data: T[];
  meta: PaginateMeta;
};
