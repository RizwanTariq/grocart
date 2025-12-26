import { auth } from "@/auth";
import connectDB from "@/libs/db";
import DeliveryAssignmentModel from "@/models/delivery-assignment.model";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import { assertAdmin } from "@/server/auth/assertAdmin";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId, convertIds } from "@/types";
import {
  DELIVERY_ASSIGNMENT_STATUS,
  ORDER_STATUS,
  USER_ROLE,
} from "@/types/enums";
import { NextResponse } from "next/server";

export const PATCH = auth(async function (request, context) {
  const params = await context.params;
  try {
    const orderId = await params.orderId;
    await connectDB();
    await assertAdmin(request);

    const { status } = await request.json();

    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }

    const order = await OrderModel.findById(orderId).populate("user");

    if (!order) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Order not found"),
        { status: 404 }
      );
    }

    let availableDeliveryBoys = [];

    if (status === ORDER_STATUS.OUT_FOR_DELIVERY && !order.deliveryAssignment) {
      const { coordinates } = order.address;

      const nearByDeliveryBoys = await UserModel.find({
        role: USER_ROLE.DELIVERY_BOY,
        isOnline: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [coordinates.lng, coordinates.lat],
            },
            $maxDistance: 20000,
          },
        },
        lastActiveAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
      });

      const nearByDelBoyIds = nearByDeliveryBoys.map((delBoy) => delBoy._id);

      const busyDelBoyIds = await DeliveryAssignmentModel.find({
        assignedTo: { $in: nearByDelBoyIds },
        status: DELIVERY_ASSIGNMENT_STATUS.ASSIGNED,
      }).distinct("assignedTo");

      availableDeliveryBoys = nearByDeliveryBoys.filter(
        (delBoy) =>
          !busyDelBoyIds.some(
            (delBoyId) => delBoyId.toString() === delBoy._id.toString()
          )
      );
      if (availableDeliveryBoys.length === 0) {
        throw NextResponse.json(
          prepareErrorResponse(
            "NO_DELIVERY_BOY",
            "No delivery boy available. Please try again later."
          ),
          { status: 400 }
        );
      }
      const deliveryAssignment = await DeliveryAssignmentModel.create({
        order: order._id,
        broadcastedTo: availableDeliveryBoys.map((delBoy) => delBoy._id),
        status: DELIVERY_ASSIGNMENT_STATUS.BROADCASTED,
      });

      order.status = ORDER_STATUS.OUT_FOR_DELIVERY;
      order.deliveryAssignment = deliveryAssignment._id;
      await order.save();

      return NextResponse.json(
        {
          order: convertId(order.toObject()),
          availableDeliveryBoys: convertIds(
            availableDeliveryBoys.map((delBoy) => delBoy.toObject())
          ),
        },
        {
          status: 200,
        }
      );
    }

    order.status = status;
    await order.save();

    return NextResponse.json(
      { order: convertId(order.toObject()), availableDeliveryBoys: [] },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleGenericError(error);
  }
});
