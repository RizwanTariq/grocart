import { NextRequest, NextResponse } from "next/server";

export async function assertOutsideReq(request: NextRequest) {
  const cronSecret = request.headers.get("x-cron-secret");

  if (cronSecret !== process.env.CRON_SECRET) {
    throw NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized request",
        },
      },
      { status: 401 }
    );
  }
  return true;
}
