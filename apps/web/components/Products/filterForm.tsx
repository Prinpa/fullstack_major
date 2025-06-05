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
    <div className="filter-form">
      <h3 className="filter-header">Filters</h3>
      
      <div className="filter-section">
        <input
          type="text"
          id="title"
          placeholder="Search by title..."
          className="search-input"
          onChange={(e) => handleInputChange('title', e.target.value)}
          defaultValue={formState.title}
        />
      </div>

      <div className="filter-section">
        <h4 className="section-title">Category</h4>
        <select
          id="category"
          className="select-input"
          onChange={(e) => handleInputChange('category', e.target.value)}
          value={formState.category}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="games">Games</option>
          <option value="phones">Phones</option>
          <option value="computing">Computing</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <div className="filter-section">
        <h4 className="section-title">Price Range</h4>
        <div className="price-inputs">
          <input
            type="number"
            id="minPrice"
            placeholder="Min"
            className="price-input"
            onChange={(e) => handleInputChange('minPrice', Number(e.target.value))}
            defaultValue={formState.minPrice || ''}
          />
          <span className="price-separator">to</span>
          <input
            type="number"
            id="maxPrice"
            placeholder="Max"
            className="price-input"
            onChange={(e) => handleInputChange('maxPrice', Number(e.target.value))}
            defaultValue={formState.maxPrice || ''}
          />
        </div>
      </div>

      <div className="filter-section">
        <h4 className="section-title">Sort By</h4>
        <select
          id="sortBy"
          className="select-input"
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
          value={formState.sortBy}
        >
          <option value="listedDate_desc">Latest</option>
          <option value="listedDate_asc">Earliest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="title_asc">Title (A-Z)</option>
          <option value="title_desc">Title (Z-A)</option>
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}