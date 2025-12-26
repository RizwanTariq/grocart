import OrdersWrapper from "./_components/OrdersWrapper";
import connectDB from "@/libs/db";
import { convertIds, IOrder } from "@/types";
import OrderModel from "@/models/order.model";

const AdminOrdersPage = async () => {
  await connectDB();
  const _orders = await OrderModel.find().lean();

  const orders = convertIds(_orders);
  return <OrdersWrapper _orders={orders as unknown as IOrder[]} />;
};

export default AdminOrdersPage;
