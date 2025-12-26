import OrdersWrapper from "./_components/OrdersWrapper";
import connectDB from "@/libs/db";
import { IOrder } from "@/types";
import OrderModel from "@/models/order.model";

const AdminOrdersPage = async () => {
  await connectDB();
  const _orders = await OrderModel.find().lean();

  const orders = JSON.parse(JSON.stringify(_orders)) as IOrder[];
  return <OrdersWrapper _orders={orders} />;
};

export default AdminOrdersPage;
