export type OptionValue = {
  id: string;
  label: string;
  price: number;
};

export type Option = {
  label: string;
  type: "select";
  values: OptionValue[];
};

export type OptionsConfig = {
  [key: string]: Option;
};

export type CartItemOption = {
  [key: string]: Option;
};

export interface CartItem {
  id: string;
  name: string;
  options: CartItemOption;
  quantity: number;
  price: number;
}
export type UserCart = {
  [key: string]: CartItem;
};
