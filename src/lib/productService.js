import products from '../data/products.json';
import categories from '../data/categories.json';

// Get all products
export function getAllProducts() {
  return products;
}

// Get product by ID
export function getProductById(id) {
  return products.find(product => product.id === id);
}

// Get products by category
export function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') {
    return products;
  }
  return products.filter(product => 
    product.category === categoryId || product.subcategory === categoryId
  );
}

// Search products
export function searchProducts(query, options = {}) {
  const {
    category = 'all',
    minPrice,
    maxPrice,
    minRating,
    prime,
    sortBy = 'relevance',
    limit,
    offset = 0
  } = options;

  let results = [...products];

  // Filter by search query
  if (query) {
    const searchTerms = query.toLowerCase().split(' ');
    results = results.filter(product => {
      const searchableText = `${product.title} ${product.description} ${product.brand} ${product.category}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  // Filter by category
  if (category && category !== 'all') {
    results = results.filter(product => 
      product.category === category || product.subcategory === category
    );
  }

  // Filter by price range
  if (minPrice !== undefined) {
    results = results.filter(product => product.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    results = results.filter(product => product.price <= maxPrice);
  }

  // Filter by rating
  if (minRating !== undefined) {
    results = results.filter(product => product.rating >= minRating);
  }

  // Filter by Prime
  if (prime) {
    results = results.filter(product => product.prime);
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
    case 'reviews':
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'newest':
      // In a real app, we'd sort by date
      results.reverse();
      break;
    default:
      // relevance - keep original order or boost by rating
      results.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
  }

  const total = results.length;

  // Apply pagination
  if (limit) {
    results = results.slice(offset, offset + limit);
  }

  return {
    products: results,
    total,
    hasMore: offset + results.length < total
  };
}

// Get deal products
export function getDealProducts(limit = 10) {
  return products
    .filter(product => product.deal)
    .slice(0, limit);
}

// Get featured products (high rating + many reviews)
export function getFeaturedProducts(limit = 10) {
  return [...products]
    .sort((a, b) => (b.rating * Math.log10(b.reviewCount)) - (a.rating * Math.log10(a.reviewCount)))
    .slice(0, limit);
}

// Get related products
export function getRelatedProducts(productId, limit = 6) {
  const product = getProductById(productId);
  if (!product) return [];

  return products
    .filter(p => 
      p.id !== productId && 
      (p.category === product.category || p.subcategory === product.subcategory)
    )
    .slice(0, limit);
}

// Get all categories
export function getAllCategories() {
  return categories;
}

// Get category by ID
export function getCategoryById(categoryId) {
  return categories.find(cat => cat.id === categoryId);
}

// Price formatting
export function formatPrice(price) {
  const [whole, fraction = '00'] = price.toFixed(2).split('.');
  return {
    whole,
    fraction,
    formatted: `$${price.toFixed(2)}`
  };
}

// Calculate savings
export function calculateSavings(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null;
  
  const savings = originalPrice - price;
  const percentage = Math.round((savings / originalPrice) * 100);
  
  return {
    amount: savings,
    percentage,
    formatted: `$${savings.toFixed(2)} (${percentage}%)`
  };
}
