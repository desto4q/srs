import { DeliveryInfo } from "@/components/DeliveryInfo";
import { calculate_cart_total } from "@/helpers/client";
import { useCartStore } from "@/store/client";

export default function Checkout() {
  const props = useCartStore();
  const deliveryFee = 3374;
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
        </ul>
      </div>
      <button className="btn btn-primary btn-block">Check Out</button>
      <DeliveryInfo />
    </div>
  );
}
