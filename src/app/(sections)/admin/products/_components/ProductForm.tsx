"use client";

import { useRef, useState, useTransition } from "react";
import { LoaderCircle, Pencil, PlusIcon } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";
import toast from "react-hot-toast";

import { PRODUCT_CATEGORY, PRODUCT_UNIT } from "@/types/enums";
import { IProduct } from "@/types";
import { categories, units } from "@/constants/product";

import Dropdown from "./form-fields/Dropdown";
import ImageUploadField, {
  ImageUploadFieldRef,
} from "./form-fields/ImageField";
import NumberField from "./form-fields/NumberField";
import TextArea from "./form-fields/TextArea";
import TextField from "./form-fields/TextField";
import { useRouter } from "next/navigation";

function ProductForm({ product }: { product?: IProduct }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [name, setName] = useState<string>(product?.name || "");
  const [description, setDescription] = useState<string>(
    product?.description || ""
  );
  const [category, setCategory] = useState<PRODUCT_CATEGORY | "">(
    product?.category || ""
  );
  const [unit, setUnit] = useState<PRODUCT_UNIT | "">(product?.unit || "");
  const [countInStock, setCountInStock] = useState<number | null>(
    product?.countInStock || null
  );
  const [price, setPrice] = useState<number | null>(product?.price || null);
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
    (image || product?.image);

  function resetForm() {
    setName("");
    setDescription("");
    setCategory("");
    setUnit("");
    setCountInStock(null);
    setPrice(null);
    imageFieldRef.current?.reset();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        if (product) {
          const result: { data: IProduct } = await axios.patch(
            `/api/admin/products/${product._id}`,
            formData
          );
          toast.success(`${result.data.name} updated successfully!}`);
          resetForm();
          router.back();
          return;
        }
        const result: { data: IProduct } = await axios.post(
          "/api/admin/products/add",
          formData
        );
        toast.success(`${result.data.name} added successfully!}`);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white w-full max-w-3xl shadow-2xl border border-rose-100 rounded-2xl p-8 md:px-10"
    >
      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
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
          existingImageUrl={product?.image}
        />

        <motion.button
          disabled={!isValidForm || isPending}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-linear-to-r from-pink-500 via-pink-600 to-pink-700 transition-all text-white font-semibold py-2.5 px-6 rounded-xl w-full cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product ? "Update Product" : "Add Product"}
          {isPending ? (
            <LoaderCircle className="animate-spin w-5 h-5" />
          ) : product ? (
            <Pencil className="w-5 h-5" />
          ) : (
            <PlusIcon className="w-5 h-5" />
          )}
        </motion.button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </motion.div>
  );
}

export default ProductForm;
