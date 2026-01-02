import { auth } from "@/auth";
import DeliveryBoyDashboard from "@/components/features/dashboard/DeliveryBoyDashboard";
import connectDB from "@/libs/db";
import DeliveryAssignmentModel from "@/models/delivery-assignment.model";

import { DELIVERY_ASSIGNMENT_STATUS } from "@/types/enums";

async function DeliveryBoyHomePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  await connectDB();

  const assignments = await DeliveryAssignmentModel.find({
    $or: [
      { broadcastedTo: userId, status: DELIVERY_ASSIGNMENT_STATUS.BROADCASTED },
      { assignedTo: userId, status: DELIVERY_ASSIGNMENT_STATUS.ASSIGNED },
      { assignedTo: userId, status: DELIVERY_ASSIGNMENT_STATUS.DELIVERED },
      { assignedTo: userId, status: DELIVERY_ASSIGNMENT_STATUS.CANCELLED },
    ],
  })
    .populate([
      {
        path: "order",
        populate: { path: "user" },
      },
    ])
    .lean();

  const availableBroadcasts = assignments.filter(
    (a) => a.status === DELIVERY_ASSIGNMENT_STATUS.BROADCASTED
  );

  const activeDelivery =
    assignments.find((a) => a.status === DELIVERY_ASSIGNMENT_STATUS.ASSIGNED) ||
    null;

  const completedDeliveries = assignments.filter(
    (a) => a.status === DELIVERY_ASSIGNMENT_STATUS.DELIVERED
  );

  const cancelledDeliveries = assignments.filter(
    (a) => a.status === DELIVERY_ASSIGNMENT_STATUS.CANCELLED
  );
  const initialData = {
    broadcasts: availableBroadcasts,
    active: activeDelivery,
    completed: completedDeliveries,
    cancelled: cancelledDeliveries,
  };

  return (
    <DeliveryBoyDashboard
      initialData={JSON.parse(JSON.stringify(initialData))}
    />
  );
}

export default DeliveryBoyHomePage;
