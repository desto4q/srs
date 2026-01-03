import { pb } from "@/api/apiClient";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/logout")({
  component: RouteComponent,
  loader: () => {
    pb.authStore.clear();
    return redirect({
      to: "/auth/login",
    });
  },
});

function RouteComponent() {
  return <div>Hello "/auth/logout"!</div>;
}
