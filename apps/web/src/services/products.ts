import { type Product } from "@repo/database";

import { PAGE_SIZE } from "~/lib/constants";

import { type PaginateResponse } from "~/models/request";

export async function fetchLatestProducts(): Promise<
  PaginateResponse<Product>
> {
  return fetch(
    `${__API_URL__}/api/products/?page=1&per_page=4&order_by=createdAt&order=desc`,
  ).then((res) => res.json());
}

