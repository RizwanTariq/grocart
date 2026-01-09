"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file: Blob): Promise<string | undefined> => {
  if (!file) return undefined;
  try {
    const arryBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arryBuffer);
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: process.env.NEXT_PUBLIC_APP_NAME?.toLowerCase() || "grocart",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url ?? undefined);
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export { uploadOnCloudinary };
