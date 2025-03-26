import { type Product } from "@repo/database";

import { PAGE_SIZE } from "~/lib/constants";

import { type PaginateResponse } from "~/models/request";

export async function fetchLatestProducts(): Promise<
  PaginateResponse<Product>
> {
  return fetch(
    `${__API_URL__}/api/products/?page=1&per_page=8&order_by=createdAt&order=desc`,
  ).then((res) => res.json());
}

export async function fetchProducts({
  page = 1,
  per_page = PAGE_SIZE,
  order_by = "createdAt",
  order = "desc",
  search,
}: {
  page?: number;
  per_page?: number;
  order_by?: string;
  order?: string;
  search?: string;
}): Promise<PaginateResponse<Product>> {
  let url = `${__API_URL__}/api/products/?page=${page}&per_page=${per_page}`;

  if (order_by && order) {
    url += `&order_by=${order_by}&order=${order}`;
  }

  if (search) {
    url += `&search=${search}`;
  }

  return fetch(url).then((res) => res.json());
}
