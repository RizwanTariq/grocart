"use client";

import { ArrowLeft, LoaderCircle, PlusCircle, PlusIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import Dropdown from "./_components/Dropdown";
import { useRef, useState, useTransition } from "react";
import NumberField from "./_components/NumberField";
import ImageUploadField, {
  ImageUploadFieldRef,
} from "./_components/ImageField";
import TextArea from "./_components/TextArea";
import TextField from "./_components/TextField";
import axios from "axios";
import { IProduct } from "@/models/products.model";

function AddProductPage() {
  const units = [
    { id: "KG", label: "Kg" },
    { id: "GRAM", label: "Gram" },
    { id: "LITRE", label: "Litre" },
    { id: "ML", label: "ml (Millilitre)" },
    { id: "PIECE", label: "Piece" },
    { id: "PACK", label: "Pack" },
    { id: "DOZEN", label: "Dozen" },
    { id: "BUNDLE", label: "Bundle" },
    { id: "BAG", label: "Bag" },
    { id: "BOX", label: "Box" },
    { id: "CAN", label: "Can" },
    { id: "BOTTLE", label: "Bottle" },
    { id: "JAR", label: "Jar" },
    { id: "TUBE", label: "Tube" },
    { id: "TRAY", label: "Tray" },
    { id: "PACKET", label: "Packet" },
    { id: "SACHET", label: "Sachet" },
    { id: "ROLL", label: "Roll" },
    { id: "BAR", label: "Bar" },
    { id: "GALLON", label: "Gallon" },
    { id: "QUART", label: "Quart" },
    { id: "SERVING", label: "Serving" },
    { id: "LB", label: "lb (Pound)" },
    { id: "OZ", label: "oz (Ounce)" },
  ];
  const categories = [
    { id: "VAGETABLES", label: "Vegetables" },
    { id: "FRUITS", label: "Fruits" },
    { id: "DAIRY_EGGS", label: "Dairy & Eggs" },
    { id: "GRAINS", label: "Grains" },
    { id: "SEAFOOD", label: "Seafood" },
    { id: "SPICES", label: "Spices" },
    { id: "BAVERAGES", label: "Beverages" },
    { id: "PERSONAL_CARE", label: "Personal Care" },
    { id: "HOUSEHOLD_ESSENTIALS", label: "Household Essentials" },
    { id: "PACKAGED_FOOD", label: "Packaged Food" },
    { id: "BABY_CARE", label: "Baby Care" },
    { id: "PET_CARE", label: "Pet Care" },
    { id: "HEALTH_AND_WELLNESS", label: "Health & Wellness" },
    { id: "CANNED_GOODS", label: "Canned Goods" },
    { id: "CONDIMENTS", label: "Condiments" },
    { id: "FROZEN", label: "Frozen" },
    { id: "OTHERS", label: "Others" },
  ];

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-rose-50 to-white py-18 px-4 relative">
      <Link
        href={"/"}
        className="absolute top-6 left-6 flex items-center gap-2 text-rose-700 font-semibold bg-white px-4 py-2 rounded-2xl shadow-md hover:bg-rose-100 hover:shadow-lg transition-all"
      >
        <ArrowLeft className="w-5 h-5" />{" "}
        <span className="hidden md:flex">Back to Home</span>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-3xl shadow-2xl border border-rose-100 rounded-2xl p-8 md:px-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <PlusCircle className="w-8 h-8 text-rose-600" />
            <h1 className="text-xl font-semibold">Add Your Product</h1>
          </div>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Fill the fields below to add your product
          </p>
        </div>
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
              onSelected={setCategory}
              value={category}
            />
            <Dropdown
              label="Unit"
              name="unit"
              key="unit"
              optionsArray={units}
              onSelected={setUnit}
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
  );
}

export default AddProductPage;
