import type { CartItem, UserCart } from "@/types";
import { useAtom } from "jotai";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";
import { toast } from "sonner";

let cart_atom = atomWithStorage<UserCart>("cart", {});
export const useCartStore = () => {
  const [cart, setCart] = useAtom(cart_atom);
  const cart_array = Object.values(cart);
  // useEffect(() => {
  //   console.log(cart);
  // }, [cart]);

  const add_to_cart = ({
    id,
    cartItem,
  }: {
    id: string;
    cartItem: CartItem;
  }) => {
    if (cart[id]) {
      // console.log(cart[id], "position");
      return toast.info("Item already in cart");
    }
    const item_id = cartItem["id"];
    const new_cart = { ...cart, [item_id]: cartItem };
    setCart(new_cart);
    toast.success("Item added to cart");
  };
  const increase_quantity = (id: string) => {
    const new_cart = { ...cart };
    if (new_cart[id]) {
      new_cart[id].quantity += 1;
    }
    setCart(new_cart);
  };
  const decrease_quantity = (id: string) => {
    const new_cart = { ...cart };
    if (new_cart[id]) {
      new_cart[id].quantity -= 1;
      if (new_cart[id].quantity === 0) {
        delete new_cart[id];
      }
    }
    setCart(new_cart);
  };
  const remove_from_cart = (id: string) => {
    const new_cart = { ...cart };
    delete new_cart[id];
    setCart(new_cart);
  };
  const clear_cart = () => {
    setCart({});
  };
  return {
    cart,
    cart_array,
    add_to_cart,
    increase_quantity,
    decrease_quantity,
    remove_from_cart,
    clear_cart,
  };
};

interface DrawerFormProps {
  min: number;
  max: number;
  category: string;
}

const filters_atom = atom<DrawerFormProps>({
  min: 0,
  max: Infinity,
  category: "",
});

export const useFiltersStore = () => {
  const [filters, setFilters] = useAtom(filters_atom);

  const updateFilters = (newFilters: DrawerFormProps) => {
    setFilters(newFilters);
  };
  const resetFilters = () => {
    setFilters({
      min: 0,
      max: Infinity,
      category: "",
    });
  };
  return {
    filters,
    updateFilters,
    resetFilters,
  };
};
