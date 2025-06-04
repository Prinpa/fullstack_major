"use client"
import { Product } from "types";
import { useState } from "react";
import { addProduct, updateProduct } from "components/productFunctions";
import DeleteProductButton from "components/Products/DeleteProductButton";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product?.id) {
      updateProduct(formState); // You need to implement this function
    } else {
      addProduct(formState);
    }
    // TODO: Add your submit logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
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
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
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
        <label htmlFor="content" className="block text-sm font-medium">Content</label>
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
        <label htmlFor="imageUrl" className="block text-sm font-medium">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formState.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium">Price</label>
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
          <label htmlFor="quantity" className="block text-sm font-medium">Quantity</label>
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
        <label htmlFor="category" className="block text-sm font-medium">Category</label>
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
            onChange={e => setFormState(prev => ({ ...prev, sold: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="ml-2">Sold</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={formState.active}
            onChange={e => setFormState(prev => ({ ...prev, active: e.target.checked }))}
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