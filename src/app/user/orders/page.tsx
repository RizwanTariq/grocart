import OrdersContainer from "./_components/OrdersContainer";
import { convertIds, IOrder } from "@/types";
import { auth } from "@/auth";
import OrderModel from "@/models/order.model";

import { MAX_PAYMENT_ATTEMPTS } from "@/constants/orders";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { castIdToObjectId } from "@/server/helpers/mongoose-parser";
import { IOrderDB } from "@/types/models/order.model";

const OrdersPage = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;

  const orders: IOrderDB[] = await OrderModel.aggregate([
    { $match: { user: castIdToObjectId(session.user?.id) } },
    { $sort: { createdAt: -1 } },
    {
      $addFields: {
        isPaymentRetryAllowed: {
          $and: [
            { $eq: ["$stripeSessionId", null] },
            { $eq: ["$paymentMethod", PAYMENT_METHOD.CARD] },
            { $eq: ["$paymentStatus", PAYMENT_STATUS.PAYMENT_PENDING] },
            { $eq: ["$status", ORDER_STATUS.PENDING] },
            {
              $and: [
                { $ifNull: ["$expiresAt", false] }, // ensure expiresAt exists
                { $gt: [{ $toDate: "$expiresAt" }, new Date()] }, // compare as Date
              ],
            },
            { $lt: ["$paymentAttempts", MAX_PAYMENT_ATTEMPTS] },
          ],
        },
      },
    },
    { $unset: ["user", "items.product"] }, // removes user and items.product
  ]);
  return <OrdersContainer orders={convertIds(orders) as IOrder[]} />;
};

export default OrdersPage;
