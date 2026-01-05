import { pb } from "@/api/apiClient";
import PageHeader from "@/components/Headers/PageHeader";
import CardContainer from "@/components/layouts/CardContainer";
import PageLoader from "@/components/layouts/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import AdminOrderCard from "../-components/AdminOrderCard";

export const Route = createFileRoute("/admin/orders/")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery({
    queryKey: ["orders-admin-list"],
    queryFn: () =>
      pb.collection("orders").getList(1, 20, {
        expand: "productId",
        filter: "status = 'pending'",
      }),
  });
  return (
    <>
      <PageHeader title="Orders" />
      <PageLoader query={query}>
        {(data) => {
          const items = data.items;
          return (
            <>
              <CardContainer>
                {items.map((item) => {
                  return <AdminOrderCard order={item as any} key={item.id} />;
                })}
              </CardContainer>
            </>
          );
        }}
      </PageLoader>
    </>
  );
}
