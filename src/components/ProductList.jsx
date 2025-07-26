import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { generateClient } from 'aws-amplify/api';
import { listProducts } from '../graphql/queries';

const client = generateClient();

const ProductList = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlistItems')) || []);
  const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem('productReviews')) || {});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await client.graphql({ query: listProducts });
      const items = result?.data?.listProducts?.items || [];

      // Group by category and sort
      const grouped = items.reduce((acc, product) => {
        const cat = product.category?.toLowerCase() || 'others';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
      }, {});

      for (const cat in grouped) {
        grouped[cat].sort((a, b) => (b.discount || 0) - (a.discount || 0));
      }

      setProductsByCategory(grouped);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError('❌ Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = (product) => {
    const exists = wishlist.some((item) => item.productId === product.id);
    const updated = exists
      ? wishlist.filter((item) => item.productId !== product.id)
      : [...wishlist, { productId: product.id, name: product.name, image: product.image }];

    setWishlist(updated);
    localStorage.setItem('wishlistItems', JSON.stringify(updated));
  };

  const handleSaveReview = (productId, reviewData) => {
    const updated = { ...reviews, [productId]: reviewData };
    setReviews(updated);
    localStorage.setItem('productReviews', JSON.stringify(updated));
  };

  const handleBid = (product) => {
    const offer = prompt(`💸 Enter your bid for ${product.name}:`, product.price);
    const bid = parseFloat(offer);
    if (!bid || bid <= 0) return alert('❌ Invalid bid.');
    if (window.confirm(`Submit bid of ₹${bid}?`)) {
      alert(`✅ Bid submitted for ₹${bid}.`);
    }
  };

  if (loading) return <p className="text-center text-gray-500 text-lg mt-10">🔄 Loading products...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold mt-10">{error}</p>;

  const categoryNames = Object.keys(productsByCategory);
  if (categoryNames.length === 0) {
    return <p className="text-center text-gray-400 mt-10">📭 No products found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">🛍️ Explore Products by Category</h2>

      {categoryNames.map((category) => (
        <section key={category} className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-700 border-b pb-1 mb-4 capitalize">
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsByCategory[category].map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  title: product.name,
                  discountPercentage: product.discount || 0,
                  rating: reviews[product.id]?.rating || 0,
                  ratingCount: reviews[product.id] ? 1 : 0,
                }}
                onBid={handleBid}
                onReviewSubmit={(reviewData) => handleSaveReview(product.id, reviewData)}
                isWished={wishlist.some((item) => item.productId === product.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductList;
