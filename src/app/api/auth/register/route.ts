import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId } from "@/types";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Email already exists"),
        {
          status: 400,
        }
      );
    }
    if (password.length < 8) {
      throw NextResponse.json(
        prepareErrorResponse(
          "BAD_REQUEST",
          "Password must be at least 8 characters long"
        ),
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(convertId(newUser), {
      status: 201,
    });
  } catch (error) {
    return handleGenericError(error);
  }
}
