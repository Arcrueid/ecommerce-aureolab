import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "~/components/hero";

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
    </>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
