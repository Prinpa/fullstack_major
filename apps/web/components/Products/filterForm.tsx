"use client"
import { useState, useEffect } from "react"
import { getUserData } from "components/authFunctions";

export type FilterState = {
  title: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  showDeleted: boolean
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
    showDeleted: false
  });

  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user role when component mounts
    const fetchUserRole = async () => {
      const userData = await getUserData();
      setUserRole(userData?.role || null);
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    onFilterChange(formState);
  }, [formState]);

  const handleInputChange = (name: keyof FilterState, value: string | number | boolean) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleDebouceInputChange = debounce((name: keyof FilterState, value: string | number | boolean) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  });

  return (
    <div className="filter-form">
      <h3 className="filter-header">Filters</h3>
      <label htmlFor="title">Title</label>
      <div className="filter-section">
        <input
          type="text"
          id="title"
          placeholder="Search by title..."
          className="search-input"
          onChange={(e) => handleDebouceInputChange('title', e.target.value)}
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
        <label htmlFor="minPrice"></label>
        <div className="price-inputs">
          <input
            type="number"
            id="minPrice"
            aria-label="minPrice"
            placeholder="Min"

            className="price-input"
            onChange={(e) => handleDebouceInputChange('minPrice', Number(e.target.value))}
            defaultValue={formState.minPrice || ''}
          />
          <span className="price-separator">to</span>
          <label htmlFor="maxPrice"></label>
          <input
            type="number"
            id="maxPrice"
            aria-label="maxPrice"

            placeholder="Max"
            className="price-input"
            onChange={(e) => handleDebouceInputChange('maxPrice', Number(e.target.value))}
            defaultValue={formState.maxPrice || ''}
          />
        </div>
      </div>

      <div className="filter-section">
        <label htmlFor="sortBy" className="section-title">Sort By</label>
        <select
          name="sortBy"
          id="sortBy"
          className="select-input"
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
          value={formState.sortBy}
        >
          <option value="listedDate_asc">Earliest</option>
          <option value="listedDate_desc">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="title_asc">Title (A-Z)</option>
          <option value="title_desc">Title (Z-A)</option>
        </select>
      </div>

      {userRole === 'admin' && (
        <div className="filter-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              id="showDeleted"
              className="checkbox-input"
              onChange={(e) => handleInputChange('showDeleted', e.target.checked)}
              checked={formState.showDeleted}
            />
            Show deleted items
          </label>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}