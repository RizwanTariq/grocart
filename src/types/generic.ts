export type Populate<T, K extends keyof T, V> = Omit<T, K> & {
  [P in K]: V;
};

export enum EmitterEvent {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_UPDATED = "ORDER_UPDATED",
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
  PRODUCT_CREATED = "PRODUCT_CREATED",
  PRODUCT_UPDATED = "PRODUCT_UPDATED",
}
