import * as Yup from "yup";
import { OrderStatus } from "~/constants/order";

export const AddressSchema = Yup.object({
  email: Yup.string().email().required().default(""),
  zip: Yup.string().required().default(""),
  city: Yup.string().required().default(""),
  address: Yup.string().required().default(""),
  comment: Yup.string().default(""),
}).defined();

export type Address = Yup.InferType<typeof AddressSchema>;

export const OrderItemSchema = Yup.object({
  productId: Yup.string().required(),
  count: Yup.number().integer().positive().required(),
}).defined();

export type OrderItem = Yup.InferType<typeof OrderItemSchema>;

export const statusHistorySchema = Yup.object({
  status: Yup.mixed<OrderStatus>().oneOf(Object.values(OrderStatus)).required(),
  timestamp: Yup.number().required(),
  comment: Yup.string().required(),
});

export type statusHistory = Yup.InferType<typeof statusHistorySchema>;

export const OrderSchema = Yup.object({
  id: Yup.string().required(),
  items: Yup.array().of(OrderItemSchema).defined(),
  payment: Yup.object().shape({
    amount: Yup.number().required(),
    method: Yup.string().required(),
    card_last4: Yup.string()
  }),
  delivery: Yup.object().shape({
    zip: Yup.string().required(),
    city: Yup.string().required(),
    address: Yup.string().required(),
  }),
  comments: Yup.string().required(),
  status: Yup.string().required(),
  total: Yup.number().required(),
}).defined();

export type Order = Yup.InferType<typeof OrderSchema>;
