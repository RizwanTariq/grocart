import { auth } from "@/auth";
import connectDB from "@/libs/db";
import DeliveryAssignmentModel from "@/models/delivery-assignment.model";
import { assertDeliveryRider } from "@/server/auth/assertdeliveryRider";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { generateOtp, hashOtp } from "@/libs/otpGenrator";
import { sendOtpEmail } from "@/libs/mailJet";
import { NextResponse } from "next/server";
import { DELIVERY_ASSIGNMENT_STATUS } from "@/types/enums";
import { IOrderDB } from "@/types/models/order.model";
import { sendWhatsappOtp } from "@/libs/sendZen";

export const POST = auth(async function (request, context) {
  const params = await context.params;
  try {
    const assignmentId = await params.id;
    await connectDB();
    const rider = await assertDeliveryRider(request);

    const assignment = await DeliveryAssignmentModel.findById(
      assignmentId
    ).populate([{ path: "order" }]);

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
    if (assignment.deliveryOtp) {
      if (
        assignment.deliveryOtp.otpHash &&
        assignment.deliveryOtp.expiresAt > new Date()
      ) {
        throw NextResponse.json(
          prepareErrorResponse(
            "BAD_REQUEST",
            "OTP already generated for this delivery. Please wait for 10 minutes."
          ),
          { status: 400 }
        );
      }
      if (assignment.deliveryOtp.attempts >= 3) {
        throw NextResponse.json(
          prepareErrorResponse(
            "BAD_REQUEST",
            "Maximum attempts reached. Please try again later."
          ),
          { status: 400 }
        );
      }
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const updatedAssignment = await DeliveryAssignmentModel.findByIdAndUpdate(
      assignmentId,
      {
        deliveryOtp: {
          otpHash,
          expiresAt,
          attempts: assignment.deliveryOtp
            ? assignment.deliveryOtp.attempts + 1
            : 1,
        },
      },
      { new: true }
    );
    if (!updatedAssignment) {
      throw NextResponse.json(
        prepareErrorResponse(
          "NOT_FOUND",
          "This delivery is no longer available!"
        ),
        { status: 404 }
      );
    }
    await updatedAssignment.populate([{ path: "order" }]);

    const order = updatedAssignment.order as unknown as IOrderDB;
    const customerEmail = order.address.email;
    const customerPhone = order.address.phone;
    const orderNumber = order.orderNumber;

    const isEmailSent = await sendOtpEmail(customerEmail, otp, orderNumber);

    if (!isEmailSent) {
      throw NextResponse.json(
        prepareErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Failed to send OTP via email. Please try again later."
        ),
        { status: 500 }
      );
    }
    const isWhatsappSent = await sendWhatsappOtp(
      customerPhone,
      otp,
      orderNumber
    );
    if (!isWhatsappSent) {
      throw NextResponse.json(
        prepareErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Failed to send OTP via whatsapp. Please try again later."
        ),
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
});
