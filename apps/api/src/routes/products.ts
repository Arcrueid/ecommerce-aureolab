import {
  type AnyColumn,
  asc,
  count,
  db,
  desc,
  eq,
  ilike,
  type SQL,
} from "@repo/database";
import { productsTable } from "@repo/database/schema";
import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import { validateParams, validateQuery } from "../middlewares/validation";
import { createPaginationMeta } from "../utils/pagination";

const router = Router();

const productIdSchema = z.object({
  id: z.string().uuid(),
});

const PaginateRequest = z.object({
  page: z.coerce.number().nullish(),
  per_page: z.coerce.number().nullish(),
  order: z.enum(["asc", "desc"]).nullish(),
  order_by: z.string().nullish(),
  search: z.string().nullish(),
});

router.get(
  "/",
  validateQuery(PaginateRequest),
  async (req: Request, response: Response, next: NextFunction) => {
    try {
      const input = req.query as unknown as z.infer<typeof PaginateRequest>;

      const page = Math.max(1, input?.page ?? 1);
      const perPage = Math.min(100, input?.per_page ?? 10);
      const offset = (page - 1) * perPage;
      const orderFn = input?.order === "asc" ? asc : desc;

      const searchTerm = input?.search?.trim();
      const whereCondition: SQL | undefined = searchTerm
        ? ilike(productsTable.name, `%${searchTerm}%`)
        : undefined;

      const [data, [countResult]] = await Promise.all([
        db
          .select()
          .from(productsTable)
          .where(whereCondition)
          .limit(perPage)
          .offset(offset)
          .orderBy(
            orderFn(
              input?.order_by
                ? (productsTable[
                    input?.order_by as keyof typeof productsTable
                  ] as AnyColumn)
                : productsTable.createdAt
            )
          )
          .execute(),
        db
          .select({ total: count() })
          .from(productsTable)
          .where(whereCondition)
          .execute(),
      ]);

      const total = countResult?.total ?? 0;

      response.status(200).json({
        data,
        meta: createPaginationMeta(page, perPage, total, offset),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  validateParams(productIdSchema),
  async (req: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = req.params as z.infer<typeof productIdSchema>;

      const product = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, id))
        .limit(1);

      if (!product || product.length === 0) {
        return next(createHttpError(404, { message: "Product not found" }));
      }

      response.status(200).json(product[0]);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
