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

  const _availableAssignments = await DeliveryAssignmentModel.find({
    broadcastedTo: userId,
    status: DELIVERY_ASSIGNMENT_STATUS.BROADCASTED,
  })
    .populate("order")
    .lean();

  const availableAssignments = JSON.parse(
    JSON.stringify(_availableAssignments)
  );

  return <DeliveryBoyDashboard initialBroadcasts={availableAssignments} />;
}

export default DeliveryBoyHomePage;
