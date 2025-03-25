import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "~/components/hero";
import { LatestProducts } from "~/components/latest-products";

function Index() {
  return (
    <>
      <h1 className="sr-only">Aureolab E-commerce</h1>
      <Hero />
      <LatestProducts />
    </>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
