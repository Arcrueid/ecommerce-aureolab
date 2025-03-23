import { createFileRoute } from "@tanstack/react-router";

function AboutPage() {
  return <div className="p-2">Hello from About!</div>;
}

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
