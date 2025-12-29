import OrdersWrapper from "./_components/OrdersWrapper";
import connectDB from "@/libs/db";
import { IOrderPopulated } from "@/types";
import OrderModel from "@/models/order.model";

const AdminOrdersPage = async () => {
  await connectDB();
  const orders = await OrderModel.find()
    .populate([
      {
        path: "assignedDeliveryBoy",
        select: "-password",
      },
      {
        path: "user",
        select: "-password",
      },
    ])
    .sort({ createdAt: -1 })
    .lean();

  return (
    <OrdersWrapper
      _orders={JSON.parse(JSON.stringify(orders)) as IOrderPopulated[]}
    />
  );
};

export default AdminOrdersPage;
