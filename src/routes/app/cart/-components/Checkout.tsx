import { pb } from "@/api/apiClient";
import { create_config } from "@/api/payment";
import { DeliveryInfo } from "@/components/DeliveryInfo";
import {
  calculate_cart_total,
  compute_total_price,
  useUser,
} from "@/helpers/client";
import { useCartStore, validate_addr } from "@/store/client";
import type { CartItemOption, OrderType } from "@/types";
import { toast } from "sonner";

import { usePaystackPayment } from "react-paystack";
import { extract_message } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";

const defaultDeliverySettings = {
  street: "",
  city: "",
  state: "",
  country: "",
  zip: "",
};
export default function Checkout() {
  const { user } = useUser();
  const query = useQuery({
    queryKey: ["delvierySettings"],
    queryFn: () =>
      pb
        .collection("deliverySettings")
        .getOne(user.id)
        .catch((stat) => {
          if (stat.status === 404) {
            pb.collection("deliverySettings").create({
              id: user.id,
              user_id: user.id,
              street: "",
              city: "",
              state: "",
              country: "",
              zip: "",
            });
            return defaultDeliverySettings;
          }
          throw stat;
        }),
    enabled: !!user,
    placeholderData: defaultDeliverySettings,
    initialData: defaultDeliverySettings,
  });
  const data = query.data;
  const { isValid, full_address } = validate_addr({
    state: data.state,
    street: data.street,
    city: data.city,
    country: data.country,
    zip: data.zip,
  });
  const initialize = usePaystackPayment(null);
  const props = useCartStore();
  const deliveryFee = 3374;
  const total = calculate_cart_total(props.cart) + deliveryFee;
  const config = create_config(total, "desto4q@gmail.com");

  const create_orders = async () => {
    if (query.isError) {
      query.refetch();
      return toast.error("Failed to fetch delivery details");
    }
    if (!isValid) return toast.error("Please fill in your delivery details");
    await pb
      .collection("users")
      .authRefresh()
      .catch((err) => {
        if (err.status === 401) {
          pb.authStore.clear();
          toast.error("Please login to continue");
          throw err;
        }
        toast.error(extract_message(err));
        throw err;
      });
    if (!user) {
      return toast.error("Please login to continue");
    }
    const orders = props.cart_array.map((item) => {
      const order = {
        productId: item.id,
        productOptions: item.options,
        userId: user.id as string,
        refId: config.reference,
        price:
          compute_total_price(item.price, item.options, item.quantity) +
          deliveryFee,
        quantity: item.quantity,
        deliveryFee: deliveryFee,
      } satisfies OrderType;
      return order;
    });

    const send_batch = async () => {
      const batch = pb.createBatch();
      for (const order of orders) {
        batch.collection("orders").create(order);
      }
      await batch.send();
    };
    initialize({
      config: config,
      onSuccess: () => {
        toast.promise(send_batch, {
          loading: "Sending orders...",
          success: () => {
            props.clear_cart();
            return "Orders sent successfully";
          },
          error: extract_message,
        });
      },
    });
  };
  // you can call this function anything

  return (
    <div className="p-4 ring fade rounded-box space-y-4">
      <h2 className="text-xl font-bold">Total</h2>
      <div className="ring p-4 fade rounded-box">
        <ul className="space-y-2">
          <li>
            <div className="flex items-center justify-between">
              <span>SubTotal:</span>
              <span className="text-right font-bold">
                NGN {calculate_cart_total(props.cart).toLocaleString()}
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-center justify-between">
              <span>Delivery Fee:</span>
              <span className="text-right font-bold">
                {" "}
                NGN {deliveryFee.toLocaleString()}
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">Total:</span>
              <span className="text-right font-bold text-primary">
                {" "}
                NGN {total.toLocaleString()}
              </span>
            </div>
          </li>
        </ul>
      </div>
      <button
        disabled={query.isLoading || query.isError}
        onClick={() => create_orders()}
        className="btn btn-primary btn-block"
      >
        {query.isLoading ? (
          <div className="flex items-center justify-center">
            <span className="loading ml-2"></span>
            <span>Loading...</span>
          </div>
        ) : (
          "Check Out"
        )}
      </button>
      <DeliveryInfo />
    </div>
  );
}
