"use client"
import { useState, useEffect } from "react"

export type FilterState = {
  title: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
}

function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timeoutId: any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function FilterForm({
  onFilterChange
}: {
  onFilterChange: (filters: FilterState) => void
}) {
  const [formState, setFormState] = useState<FilterState>({
    title: "",
    category: "",
    minPrice: 0,
    maxPrice: 0,
    sortBy: "listedDate",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onFilterChange(formState);
  }, [formState]);

  const handleInputChange = debounce((name: keyof FilterState, value: string | number) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  }, 500);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filter Products</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Search by title</label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            onChange={(e) => handleInputChange('title', e.target.value)}
            defaultValue={formState.title}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">Category</label>
          <select
            id="category"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            onChange={(e) => handleInputChange('category', e.target.value)}
            value={formState.category}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium">Min Price</label>
            <input
              type="number"
              id="minPrice"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              onChange={(e) => handleInputChange('minPrice', Number(e.target.value))}
              defaultValue={formState.minPrice}
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              onChange={(e) => handleInputChange('maxPrice', Number(e.target.value))}
              defaultValue={formState.maxPrice}
            />
          </div>
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium">Sort By</label>
          <select
            id="sortBy"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
            value={formState.sortBy}
          >
            <option value="listedDate_desc">Latest</option>
            <option value="listedDate_asc">Earliest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Title (asc)</option>
            <option value="title_desc">Title (desc)</option>
          </select>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}