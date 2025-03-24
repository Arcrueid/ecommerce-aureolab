import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

function Index() {
  const [products, setProducts] = useState("hola");

  useEffect(() => {
    if (products !== "hola") {
      setProducts("adios");
    }
    console.log({ products });
  }, [products, setProducts]);

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
