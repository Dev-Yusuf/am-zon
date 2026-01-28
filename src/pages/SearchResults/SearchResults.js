import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { searchProducts, getAllCategories } from '../../lib/productService';
import './SearchResults.css';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minRating = searchParams.get('minRating');
  const prime = searchParams.get('prime') === 'true';
  const deal = searchParams.get('deal') === 'true';

  const categories = getAllCategories();

  useEffect(() => {
    setLoading(true);
    
    // Simulate async fetch
    setTimeout(() => {
      const searchResults = searchProducts(query, {
        category,
        sortBy,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        prime
      });

      // Filter by deals if needed
      if (deal) {
        searchResults.products = searchResults.products.filter(p => p.deal);
        searchResults.total = searchResults.products.length;
      }

      setResults(searchResults);
      setLoading(false);
    }, 300);
  }, [query, category, sortBy, minPrice, maxPrice, minRating, prime, deal]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(query ? { q: query } : {});
  };

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 to $50', min: 25, max: 50 },
    { label: '$50 to $100', min: 50, max: 100 },
    { label: '$100 to $200', min: 100, max: 200 },
    { label: '$200 & Above', min: 200, max: undefined }
  ];

  const ratingOptions = [4, 3, 2, 1];

  return (
    <div className="search-results container">
      {/* Filters Sidebar */}
      <aside className={`search-results__sidebar ${showFilters ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h3>Filters</h3>
          <button 
            className="sidebar-close"
            onClick={() => setShowFilters(false)}
          >
            ✕
          </button>
        </div>

        {/* Category Filter */}
        <div className="filter-section">
          <h4 className="filter-title">Department</h4>
          <ul className="filter-list">
            <li>
              <button
                className={`filter-link ${category === 'all' ? 'active' : ''}`}
                onClick={() => updateFilter('category', 'all')}
              >
                All Departments
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <button
                  className={`filter-link ${category === cat.id ? 'active' : ''}`}
                  onClick={() => updateFilter('category', cat.id)}
                >
                  {cat.name}
                </button>
                {category === cat.id && cat.subcategories && (
                  <ul className="filter-sublist">
                    {cat.subcategories.map(sub => (
                      <li key={sub.id}>
                        <button
                          className="filter-link"
                          onClick={() => updateFilter('category', sub.id)}
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Rating Filter */}
        <div className="filter-section">
          <h4 className="filter-title">Customer Review</h4>
          <ul className="filter-list">
            {ratingOptions.map(rating => (
              <li key={rating}>
                <button
                  className={`filter-link filter-rating ${minRating === String(rating) ? 'active' : ''}`}
                  onClick={() => updateFilter('minRating', rating)}
                >
                  <span className="stars">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} className={i < rating ? 'filled' : ''}>
                        {i < rating ? '★' : '☆'}
                      </span>
                    ))}
                  </span>
                  <span>& Up</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Filter */}
        <div className="filter-section">
          <h4 className="filter-title">Price</h4>
          <ul className="filter-list">
            {priceRanges.map((range, index) => (
              <li key={index}>
                <button
                  className={`filter-link ${minPrice === String(range.min) ? 'active' : ''}`}
                  onClick={() => {
                    updateFilter('minPrice', range.min);
                    updateFilter('maxPrice', range.max);
                  }}
                >
                  {range.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="price-input-group">
            <input
              type="number"
              placeholder="Min"
              className="price-input"
              onChange={(e) => updateFilter('minPrice', e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="price-input"
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
            />
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {}}
            >
              Go
            </button>
          </div>
        </div>

        {/* Prime Filter */}
        <div className="filter-section">
          <h4 className="filter-title">Delivery</h4>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={prime}
              onChange={(e) => updateFilter('prime', e.target.checked ? 'true' : '')}
            />
            <span className="prime-badge">prime</span>
            <span>FREE Delivery</span>
          </label>
        </div>

        {/* Deals Filter */}
        <div className="filter-section">
          <h4 className="filter-title">Deals & Discounts</h4>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={deal}
              onChange={(e) => updateFilter('deal', e.target.checked ? 'true' : '')}
            />
            <span>Today's Deals</span>
          </label>
        </div>

        <button className="btn btn-secondary clear-filters" onClick={clearFilters}>
          Clear all filters
        </button>
      </aside>

      {/* Results */}
      <main className="search-results__main">
        {/* Results Header */}
        <div className="search-results__header">
          <div className="search-results__info">
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(true)}
            >
              ☰ Filters
            </button>
            {query && (
              <span className="search-results__query">
                Results for "<strong>{query}</strong>"
              </span>
            )}
            <span className="search-results__count">
              {results.total.toLocaleString()} results
            </span>
          </div>

          <div className="search-results__sort">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="reviews">Most Reviews</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="search-results__loading">
            <div className="spinner"></div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && (
          <>
            {results.products.length === 0 ? (
              <div className="search-results__empty">
                <h3>No results found</h3>
                <p>Try different keywords or remove some filters.</p>
              </div>
            ) : (
              <div className="search-results__grid">
                {results.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Overlay for mobile filters */}
      {showFilters && (
        <div 
          className="sidebar-overlay"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}

export default SearchResults;
