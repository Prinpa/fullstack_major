"use client";
import { Product } from "types";
import { useState, useRef } from "react";
import { addProduct, updateProduct } from "components/productFunctions";
import DeleteProductButton from "components/Products/DeleteProductButton";
import Image from "next/image";

export function AddProductForm({ product }: { product?: Product }) {
  const [formState, setFormState] = useState({
    id: product?.id || 0,
    title: product?.title || "",
    content: product?.content || "",
    description: product?.description || "",
    imageUrl: product?.imageUrl || "",
    listedDate: product?.listedDate || new Date(),
    soldDate: product?.soldDate || null,
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    category: product?.category || "",
    sold: product?.sold || false,
    active: (product?.active || true) as boolean,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("content", formState.content);
    formData.append("description", formState.description);
    formData.append("price", formState.price.toString());
    formData.append("quantity", formState.quantity.toString());
    formData.append("category", formState.category);
    formData.append("sold", formState.sold.toString());
    formData.append("active", formState.active.toString());
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (product?.id) {
      formData.append("id", product.id.toString());
      await updateProduct(formData);
    } else {
      await addProduct(formData);
    }
    // Reset form after submission
    setFormState({
      id: 0,
      title: "",
      content: "",
      description: "",
      imageUrl: "",
      listedDate: new Date(),
      soldDate: null,
      price: 0,
      quantity: 0,
      category: "",
      sold: false,
      active: true,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formState.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formState.content}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Product Image</label>
        <div
          className={`mt-1 border-2 border-dashed rounded-md p-4 text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-gray-500">
            Drag and drop an image here, or{" "}
            <button
              type="button"
              onClick={handleBrowseClick}
              className="text-blue-500 hover:underline"
            >
              browse files
            </button>
          </p>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
        </div>
        {imagePreview && (
          <div className="mt-2">
            <p className="text-sm font-medium">Preview:</p>
            <Image
              src={imagePreview}
              alt="Image preview"
              width={200}
              height={200}
              className="mt-1 rounded-md"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formState.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formState.quantity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            min="0"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formState.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="sold"
            checked={formState.sold}
            onChange={(e) => setFormState((prev) => ({ ...prev, sold: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="ml-2">Sold</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={formState.active}
            onChange={(e) => setFormState((prev) => ({ ...prev, active: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="ml-2">Active</span>
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
      {product?.id && <DeleteProductButton id={product.id} />}
    </form>
  );
}