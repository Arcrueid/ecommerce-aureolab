import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

function Index() {
  const [products, setProducts] = useState("hola");

  useEffect(() => {
    if (products !== "hola") {
      setProducts("adios");
    }
    console.log({ products });
  }, [products]);

  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
