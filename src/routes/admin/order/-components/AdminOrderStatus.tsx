import { pb } from "@/api/apiClient";
import { extract_message } from "@/helpers/api";
import type { Collections, OrdersResponse } from "pocketbase-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Package, Truck } from "lucide-react";
import { toast } from "sonner";

const status_list = ["pending", "processing", "in transit", "delivered"];

const status_icons: Record<string, any> = {
  pending: Package,
  processing: CheckCircle2,
  "in transit": Truck,
  delivered: CheckCircle2,
};

export default function OrderStatus({
  status,
  refetch,
}: {
  status: string;
  refetch: () => void;
}) {
  const queryClient = useQueryClient();
  const { orderId } = useParams({
    strict: false,
  });

  const return_next_status = (currentStatus: string) => {
    const index = status_list.indexOf(currentStatus);
    if (index === -1 || index === status_list.length - 1) return null;
    return status_list[index + 1];
  };

  const nextStatus = return_next_status(status);

  const mutation = useMutation({
    mutationFn: (newStatus: string) =>
      pb
        .collection("orders")
        .update<OrdersResponse>(orderId!, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      refetch();
    },
  });

  return (
    <div className="card bg-base-100 border border-base-300 shadow-md overflow-hidden">
      <div className="card-body p-0">
        <div className="p-5 bg-base-200/30 border-b border-base-300 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-tight opacity-50">
                Order Status
              </h3>
              <div className="badge badge-primary badge-md capitalize font-bold gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-content opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-content"></span>
                </span>
                {status}
              </div>
            </div>
          </div>

          {nextStatus && (
            <button
              onClick={() =>
                toast.promise(mutation.mutateAsync(nextStatus), {
                  loading: "Updating status...",
                  success: `Order moved to ${nextStatus}`,
                  error: extract_message,
                })
              }
              disabled={mutation.isPending}
              className="btn btn-primary btn-sm md:btn-md shadow-sm hover:shadow-md transition-all"
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  Mark as {nextStatus}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          )}
        </div>

        <div className="p-8 bg-gradient-to-b from-transparent to-base-200/20">
          <ul className="steps steps-vertical lg:steps-horizontal w-full">
            {status_list.map((stat, index) => {
              const currentStatusIndex = status_list.indexOf(status);
              const isCompleted = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const Icon = status_icons[stat] || Package;

              return (
                <li
                  key={stat}
                  className={`step transition-all duration-500 ${
                    isCompleted || isCurrent ? "step-primary" : ""
                  }`}
                  data-content={isCompleted ? "✓" : index + 1}
                >
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <div
                      className={`p-2 rounded-full transition-colors ${
                        isCurrent
                          ? "bg-primary text-primary-content shadow-lg scale-110"
                          : isCompleted
                            ? "bg-primary/20 text-primary"
                            : "bg-base-300 text-base-content/30"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        isCurrent ? "text-primary" : "opacity-50"
                      }`}
                    >
                      {stat}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
