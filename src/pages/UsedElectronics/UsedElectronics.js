import React, { useState, useMemo } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getAllProducts } from '../../lib/productService';
import './UsedElectronics.css';

function UsedElectronics() {
  const [sortBy, setSortBy] = useState('relevance');
  const [filterType, setFilterType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Get all used products (cameras and tripods)
  const usedProducts = useMemo(() => {
    return getAllProducts().filter(product => product.isUsed === true);
  }, []);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let results = [...usedProducts];

    // Filter by type
    if (filterType === 'cameras') {
      results = results.filter(p => p.subcategory === 'used-cameras');
    } else if (filterType === 'tripods') {
      results = results.filter(p => p.subcategory === 'used-tripods');
    }

    // Filter by price range
    if (priceRange === 'under100') {
      results = results.filter(p => p.price < 100);
    } else if (priceRange === '100to300') {
      results = results.filter(p => p.price >= 100 && p.price <= 300);
    } else if (priceRange === '300to500') {
      results = results.filter(p => p.price >= 300 && p.price <= 500);
    } else if (priceRange === 'over500') {
      results = results.filter(p => p.price > 500);
    }

    // Sort results
    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // relevance - mix cameras and tripods
        break;
    }

    return results;
  }, [usedProducts, filterType, priceRange, sortBy]);

  const cameraCount = usedProducts.filter(p => p.subcategory === 'used-cameras').length;
  const tripodCount = usedProducts.filter(p => p.subcategory === 'used-tripods').length;

  return (
    <div className="used-electronics">
      {/* Hero Section */}
      <div className="used-electronics__hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">PRE-OWNED</span>
            <h1>Used Electronics</h1>
            <p>Quality cameras and tripods at unbeatable prices. All items tested and verified.</p>
          </div>
        </div>
      </div>

      <div className="used-electronics__content container">
        {/* Sidebar Filters */}
        <aside className="used-electronics__sidebar">
          <div className="filter-section">
            <h3>Category</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="type"
                  checked={filterType === 'all'}
                  onChange={() => setFilterType('all')}
                />
                <span>All Items ({usedProducts.length})</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="type"
                  checked={filterType === 'cameras'}
                  onChange={() => setFilterType('cameras')}
                />
                <span>Digital Cameras ({cameraCount})</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="type"
                  checked={filterType === 'tripods'}
                  onChange={() => setFilterType('tripods')}
                />
                <span>Tripods ({tripodCount})</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'all'}
                  onChange={() => setPriceRange('all')}
                />
                <span>All Prices</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'under100'}
                  onChange={() => setPriceRange('under100')}
                />
                <span>Under $100</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === '100to300'}
                  onChange={() => setPriceRange('100to300')}
                />
                <span>$100 - $300</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === '300to500'}
                  onChange={() => setPriceRange('300to500')}
                />
                <span>$300 - $500</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'over500'}
                  onChange={() => setPriceRange('over500')}
                />
                <span>Over $500</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Brands Available</h3>
            <div className="brand-tags">
              <span className="brand-tag">Sony</span>
              <span className="brand-tag">Canon</span>
              <span className="brand-tag">Nikon</span>
              <span className="brand-tag">Fujifilm</span>
              <span className="brand-tag">Panasonic</span>
              <span className="brand-tag">Manfrotto</span>
              <span className="brand-tag">Vanguard</span>
            </div>
          </div>

          <div className="quality-guarantee">
            <div className="guarantee-icon">✓</div>
            <div className="guarantee-text">
              <strong>Quality Guaranteed</strong>
              <p>All items inspected and tested before listing</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="used-electronics__main">
          <div className="results-header">
            <div className="results-info">
              <span className="results-count">{filteredProducts.length} items</span>
              {filterType !== 'all' && (
                <span className="results-filter">
                  in {filterType === 'cameras' ? 'Digital Cameras' : 'Tripods'}
                </span>
              )}
            </div>
            <div className="results-sort">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="relevance">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default UsedElectronics;
