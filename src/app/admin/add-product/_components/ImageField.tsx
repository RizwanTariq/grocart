"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export type ImageUploadFieldRef = {
  reset: () => void;
};
type Props = {
  currentImage: Blob | null;
  onCurrentImage: (image: Blob | null) => void;
};

const ImageUploadField = forwardRef<ImageUploadFieldRef, Props>(
  ({ onCurrentImage }, ref) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // --- EXPOSE API TO PARENT ---
    useImperativeHandle(ref, () => ({
      reset() {
        setPreview(null);
        onCurrentImage(null);

        const input = document.getElementById("image") as HTMLInputElement;
        const input2 = document.getElementById(
          "image-change"
        ) as HTMLInputElement;

        if (input) input.value = "";
        if (input2) input2.value = "";
      },
    }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onCurrentImage(file);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Update the input element
        const input = document.getElementById("image") as HTMLInputElement;
        if (input) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;
        }

        onCurrentImage(file);
      }
    };

    const removeImage = () => {
      setPreview(null);
      const input = document.getElementById("image") as HTMLInputElement;
      if (input) {
        input.value = "";
      }
    };

    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <label
          htmlFor="image"
          className="block text-gray-700 font-medium mb-3 text-sm"
        >
          Product Image <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          {!preview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                isDragging
                  ? "border-rose-500 bg-rose-50"
                  : "border-gray-300 bg-gray-50 hover:border-rose-400 hover:bg-rose-50/50"
              }`}
            >
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="w-16 h-16 bg-linear-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-rose-600" />
                </div>

                <p className="text-gray-700 font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50 h-64">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Image uploaded
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <label
                htmlFor="image-change"
                className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-700 text-sm font-medium rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg opacity-0 group-hover:opacity-100 z-10"
              >
                Change Image
              </label>
              <input
                type="file"
                id="image-change"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Recommended: Square image, at least 800x800px for best quality
        </p>
      </div>
    );
  }
);

ImageUploadField.displayName = "ImageUploadField";
export default ImageUploadField;
