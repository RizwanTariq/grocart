"use client";

import { useRef, useState, useTransition } from "react";
import { ArrowLeft, LoaderCircle, PlusIcon } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

import { IProduct } from "@/types";

import Dropdown from "./_components/Dropdown";
import NumberField from "./_components/NumberField";
import ImageUploadField, {
  ImageUploadFieldRef,
} from "./_components/ImageField";
import TextArea from "./_components/TextArea";
import TextField from "./_components/TextField";
import { categories, units } from "@/constants/product";
import { useRouter } from "next/navigation";
import { PRODUCT_CATEGORY, PRODUCT_UNIT } from "@/types/enums";

function AddProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<PRODUCT_CATEGORY | "">("");
  const [unit, setUnit] = useState<PRODUCT_UNIT | "">("");
  const [countInStock, setCountInStock] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [image, setImage] = useState<Blob | null>(null);
  const imageFieldRef = useRef<ImageUploadFieldRef>(null);

  const isValidForm =
    name &&
    name.length >= 2 &&
    description.length >= 8 &&
    category &&
    unit &&
    countInStock &&
    price &&
    image;

  function resetForm() {
    setName("");
    setDescription("");
    setCategory("");
    setUnit("");
    setCountInStock(null);
    setPrice(null);
    imageFieldRef.current?.reset();
  }

  async function addProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("unit", unit);
    formData.append("countInStock", countInStock as unknown as string);
    formData.append("price", price as unknown as string);
    formData.append("image", image as Blob);
    startTransition(async () => {
      setError("");
      try {
        const result = await axios.post("/api/admin/add-product", formData);
        console.log(result.data as IProduct);
        resetForm();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    });
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Add Your Product
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Fill the fields below to add your product
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-10 px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white w-full max-w-3xl shadow-2xl border border-rose-100 rounded-2xl p-8 md:px-10"
        >
          <form className="flex flex-col gap-6 w-full" onSubmit={addProduct}>
            <TextField
              name="name"
              label="Product Name"
              value={name}
              placeholder="eg. Banana"
              required
              onChange={(n) => setName(n)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Dropdown
                label="Category"
                name="category"
                key="category"
                optionsArray={categories}
                onSelected={(value) => setCategory(value as PRODUCT_CATEGORY)}
                value={category}
              />
              <Dropdown
                label="Unit"
                name="unit"
                key="unit"
                optionsArray={units}
                onSelected={(value) => setUnit(value as PRODUCT_UNIT)}
                value={unit}
              />
            </div>

            <TextArea
              name="description"
              label="Description"
              value={description}
              onChange={(d) => setDescription(d)}
              rows={3}
              placeholder="Write a short description..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberField
                name="price"
                label="Price"
                value={price}
                onChange={(p) => setPrice(p)}
              />
              <NumberField
                name="countInStock"
                label="Stock Quantity"
                value={countInStock}
                onChange={(c) => setCountInStock(c)}
              />
            </div>

            <ImageUploadField
              currentImage={image}
              onCurrentImage={setImage}
              ref={imageFieldRef}
            />

            <motion.button
              disabled={!isValidForm || isPending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-linear-to-r from-pink-500 via-pink-600 to-pink-700 transition-all text-white font-semibold py-2.5 px-6 rounded-xl w-full cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Product
              {isPending ? (
                <LoaderCircle className="animate-spin w-5 h-5" />
              ) : (
                <PlusIcon className="w-5 h-5" />
              )}
            </motion.button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default AddProductPage;
