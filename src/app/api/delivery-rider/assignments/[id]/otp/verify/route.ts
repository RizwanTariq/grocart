import { auth } from "@/auth";
import connectDB from "@/libs/db";
import DeliveryAssignmentModel from "@/models/delivery-assignment.model";
import { assertDeliveryRider } from "@/server/auth/assertdeliveryRider";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { verifyOtp } from "@/libs/otpGenrator";
import { NextResponse } from "next/server";
import {
  DELIVERY_ASSIGNMENT_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "@/types/enums";
import OrderModel from "@/models/order.model";

export const POST = auth(async function (request, context) {
  const params = await context.params;
  try {
    const assignmentId = await params.id;
    await connectDB();
    const rider = await assertDeliveryRider(request);

    const assignment = await DeliveryAssignmentModel.findById(assignmentId)
    .populate([{ path: "order" }, { path: "assignedTo", select: "-password" }]);

    if (!assignment) {
      throw NextResponse.json(
        prepareErrorResponse(
          "NOT_FOUND",
          "This delivery is no longer available!"
        ),
        { status: 404 }
      );
    }
    if (!assignment.assignedTo?.equals(rider._id)) {
      throw NextResponse.json(
        prepareErrorResponse("UNAUTHORIZED", "This delivery is not for you!"),
        { status: 401 }
      );
    }
    if (assignment.status !== DELIVERY_ASSIGNMENT_STATUS.ASSIGNED) {
      throw NextResponse.json(
        prepareErrorResponse(
          "BAD_REQUEST",
          "This delivery is not accepted yet!"
        ),
        { status: 400 }
      );
    }
    if (!assignment.deliveryOtp) {
      throw NextResponse.json(
        prepareErrorResponse(
          "BAD_REQUEST",
          "OTP not generated for this delivery!"
        ),
        { status: 400 }
      );
    }

    if (assignment.deliveryOtp.expiresAt < new Date()) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "OTP expired!"),
        { status: 400 }
      );
    }

    const { otp } = await request.json();
    if (!otp) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "OTP is required!"),
        { status: 400 }
      );
    }

    const isOtpValid = verifyOtp(otp, assignment.deliveryOtp.otpHash);
    if (!isOtpValid) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Invalid OTP!"),
        { status: 400 }
      );
    }

    assignment.status = DELIVERY_ASSIGNMENT_STATUS.DELIVERED;
    assignment.deliveredAt = new Date();
    await assignment.save();
    const order = await OrderModel.findById(assignment.order);
    if (!order) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Order not found!"),
        { status: 404 }
      );
    }
    order.status = ORDER_STATUS.DELIVERED;
    order.paymentStatus = PAYMENT_STATUS.PAYMENT_PAID;
    await order.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
});
