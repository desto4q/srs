import PageFooter from "@/components/PageFooter";
import PageHeader from "@/components/PageHeader";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageHeader />
      <Outlet />
      <PageFooter />
    </>
  );
}
