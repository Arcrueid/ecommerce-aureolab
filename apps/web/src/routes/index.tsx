import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "~/components/hero";
import { LatestProducts } from "~/components/latest-products";

function Index() {
  const [products, setProducts] = useState("hola");

  useEffect(() => {
    if (products !== "hola") {
      setProducts("adios");
    }
    console.log({ products });
  }, [products]);

  return (
    <>
      <Hero />
      <LatestProducts />
    </>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
