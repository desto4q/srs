import { pb } from "@/api/apiClient";
import CompLoader from "@/components/layouts/ComponentLoader";
import { render_status } from "@/helpers/ui";
import { validate_addr } from "@/store/client";
import type { OptionsConfig } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type {
  OrdersRecord,
  OrdersResponse,
  ProductsRecord,
} from "pocketbase-types";

export default function AdminOrderCard({
  order,
}: {
  order: OrdersResponse<OptionsConfig, ProductsRecord>;
}) {
  const [showAddress, setShowAddress] = useState(false);
  const product = order.expand?.["productId"] as ProductsRecord;
  const date = new Date(order.created).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = new Date(order.created).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const productOptions = order["productOptions"] as OptionsConfig;
  const keys = Object.keys(productOptions);

  return (
    <div
      key={order.id}
      className="group relative bg-base-100 border border-base-300 rounded-box overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <div className="p-6 flex flex-col h-full gap-5">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="badge badge-ghost badge-sm font-bold tracking-wider uppercase">
                #{order.refId || order.id.slice(0, 5)}
              </span>
              <span className="text-[11px] font-medium text-base-content/60">
                {time}
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-base-content">
              {product?.name || "Product"}
            </h2>
          </div>
          <div className="shrink-0 scale-90 origin-top-right">
            {render_status(order.status as any)}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 py-4 border-y border-base-200">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wide">
              Order Date
            </span>
            <span className="text-sm font-medium text-base-content/80">
              {date}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wide">
              Quantity
            </span>
            <span className="text-sm font-bold text-base-content">
              {order.quantity}{" "}
              <span className="text-base-content/40 font-normal">units</span>
            </span>
          </div>
        </div>

        {/* Product Options */}
        {keys.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keys.map((item) => (
              <div
                key={item}
                className="px-2.5 py-1 rounded-md bg-base-200/50 border border-base-300 text-[12px] flex gap-1.5"
              >
                <span className="text-base-content/50">{item}</span>
                <span className="font-semibold text-base-content/80">
                  {productOptions[item].values[0].label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Section */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wide">
              Total
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tighter text-base-content">
                ₦{(order.price + order.deliveryFee).toLocaleString()}
              </span>
              <span className="text-[10px] text-base-content/50 font-medium">
                NGN
              </span>
            </div>
          </div>
          <div className="text-[10px] font-medium px-2 py-1 rounded bg-base-200 text-base-content/60">
            Shipping Included
          </div>
        </div>

        {/* Shipping Toggle */}
        <div className="mt-2">
          {showAddress ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <ShippingAddress user_id={order.userId} />
            </div>
          ) : (
            <button
              onClick={() => setShowAddress(true)}
              className="btn btn-ghost btn-xs w-full font-semibold text-base-content/60 hover:text-base-content transition-colors flex items-center justify-center gap-1"
            >
              Show Delivery Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <Link
            to={`/admin/order/${order.id}`}
            className="btn btn-primary w-full rounded-xl text-sm font-bold transition-all active:scale-[0.98] shadow-lg"
          >
            Manage Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export const ShippingAddress = ({ user_id }: { user_id: string }) => {
  const query = useQuery({
    queryKey: ["shipping-address", user_id],
    queryFn: async () => pb.collection("deliverySettings").getOne(user_id),
    enabled: !!user_id,
  });

  return (
    <div className="rounded-xl border border-base-300 bg-base-200/30 overflow-hidden">
      <div className="px-3 py-2 bg-base-200/50 border-b border-base-300 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-base-content/70">
          Shipping Address
        </h2>
      </div>
      <div className="p-3">
        <CompLoader
          query={query}
          customError={() => (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-xs text-error font-medium">
                Failed to load address
              </span>
              <button
                onClick={() => query.refetch()}
                className="btn btn-ghost btn-xs text-error hover:bg-error/10"
              >
                Retry
              </button>
            </div>
          )}
          customLoading={
            <div className="flex items-center gap-3 py-1">
              <span className="loading loading-spinner loading-xs text-primary"></span>
              <span className="text-xs font-medium text-base-content/50">
                Fetching details...
              </span>
            </div>
          }
        >
          {(data) => {
            const { full_address } = validate_addr(data);
            return (
              <p className="text-sm leading-relaxed text-base-content/80 font-medium">
                {full_address || "No address provided"}
              </p>
            );
          }}
        </CompLoader>
      </div>
    </div>
  );
};
