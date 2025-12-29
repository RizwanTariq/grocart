import OrdersWrapper from "./_components/OrdersWrapper";
import { IOrderPopulated } from "@/types";
import { auth } from "@/auth";
import OrderModel from "@/models/order.model";

import { MAX_PAYMENT_ATTEMPTS } from "@/constants/orders";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { castIdToObjectId } from "@/server/helpers/mongoose-parser";
import { IOrderDB } from "@/types/models/order.model";
import connectDB from "@/libs/db";

const OrdersPage = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;

  await connectDB();

  const orders: IOrderDB[] = await OrderModel.aggregate([
    { $match: { user: castIdToObjectId(session.user?.id) } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "assignedDeliveryBoy",
        foreignField: "_id",
        as: "assignedDeliveryBoy",
      },
    },
    {
      $unwind: {
        path: "$assignedDeliveryBoy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        isPaymentRetryAllowed: {
          $and: [
            {
              $eq: [{ $ifNull: ["$stripeSessionId", null] }, null],
            },
            { $eq: ["$paymentMethod", PAYMENT_METHOD.CARD] },
            { $eq: ["$paymentStatus", PAYMENT_STATUS.PAYMENT_PENDING] },
            { $eq: ["$status", ORDER_STATUS.PENDING] },
            {
              $and: [
                { $ne: ["$expiresAt", null] },
                { $gt: [{ $toDate: "$expiresAt" }, new Date()] },
              ],
            },
            { $lt: ["$paymentAttempts", MAX_PAYMENT_ATTEMPTS] },
          ],
        },
      },
    },
  ]);
  return (
    <OrdersWrapper
      initialOrders={JSON.parse(JSON.stringify(orders)) as IOrderPopulated[]}
    />
  );
};

export default OrdersPage;
