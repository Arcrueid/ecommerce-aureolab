import { z } from "zod";

export const PaginateRequest = z.object({
  page: z.coerce.number().nullish(),
  per_page: z.coerce.number().nullish(),
  order: z.enum(["asc", "desc"]).nullish(),
  order_by: z.string().nullish(),
  search: z.string().nullish(),
});

export type PaginateRequest = z.infer<typeof PaginateRequest>;

export type PaginateResponse<T> = {
  data: T[];
  meta: PaginateRequest;
};
