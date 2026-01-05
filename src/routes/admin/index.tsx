import { createFileRoute } from "@tanstack/react-router";
import AdminDashStats from "./-components/AdminDashStats";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <AdminDashStats />
    </div>
  );
}
