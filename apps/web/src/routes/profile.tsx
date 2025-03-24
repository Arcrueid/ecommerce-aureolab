import { createFileRoute } from "@tanstack/react-router";

function ProfilePage() {
  return <div className="p-2">Hello from Profile!</div>;
}

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});
