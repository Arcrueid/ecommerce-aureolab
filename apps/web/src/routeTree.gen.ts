/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ProductosImport } from './routes/productos'
import { Route as OrdersImport } from './routes/orders'
import { Route as CheckoutImport } from './routes/checkout'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const ProductosRoute = ProductosImport.update({
  id: '/productos',
  path: '/productos',
  getParentRoute: () => rootRoute,
} as any)

const OrdersRoute = OrdersImport.update({
  id: '/orders',
  path: '/orders',
  getParentRoute: () => rootRoute,
} as any)

const CheckoutRoute = CheckoutImport.update({
  id: '/checkout',
  path: '/checkout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/checkout': {
      id: '/checkout'
      path: '/checkout'
      fullPath: '/checkout'
      preLoaderRoute: typeof CheckoutImport
      parentRoute: typeof rootRoute
    }
    '/orders': {
      id: '/orders'
      path: '/orders'
      fullPath: '/orders'
      preLoaderRoute: typeof OrdersImport
      parentRoute: typeof rootRoute
    }
    '/productos': {
      id: '/productos'
      path: '/productos'
      fullPath: '/productos'
      preLoaderRoute: typeof ProductosImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/checkout': typeof CheckoutRoute
  '/orders': typeof OrdersRoute
  '/productos': typeof ProductosRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/checkout': typeof CheckoutRoute
  '/orders': typeof OrdersRoute
  '/productos': typeof ProductosRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/checkout': typeof CheckoutRoute
  '/orders': typeof OrdersRoute
  '/productos': typeof ProductosRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/checkout' | '/orders' | '/productos'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/checkout' | '/orders' | '/productos'
  id: '__root__' | '/' | '/checkout' | '/orders' | '/productos'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CheckoutRoute: typeof CheckoutRoute
  OrdersRoute: typeof OrdersRoute
  ProductosRoute: typeof ProductosRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CheckoutRoute: CheckoutRoute,
  OrdersRoute: OrdersRoute,
  ProductosRoute: ProductosRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/checkout",
        "/orders",
        "/productos"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/checkout": {
      "filePath": "checkout.tsx"
    },
    "/orders": {
      "filePath": "orders.tsx"
    },
    "/productos": {
      "filePath": "productos.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
