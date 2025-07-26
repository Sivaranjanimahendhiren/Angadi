import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getProduct } from '../graphql/queries';

const client = generateClient();

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

const ProductDetails = ({ onAddToCart }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);

  const fetchProduct = useCallback(async () => {
    try {
      const result = await client.graphql({
        query: getProduct,
        variables: { id: productId },
      });

      const fetchedProduct = result.data.getProduct;
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setReviews(fetchedProduct.reviews?.items || []);
      } else {
        setError('Product not found.');
      }
    } catch (err) {
      console.error('❌ Error fetching product:', err);
      setError('❌ Failed to load product details.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();

    const savedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setWishlisted(savedWishlist.some((item) => item.productId === productId));

    const savedReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
    if (savedReviews[productId]) {
      setReviews(savedReviews[productId]);
    }
  }, [productId, fetchProduct]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    setAdding(true);
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existing = cartItems.find((item) => item.productId === product.id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cartItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
        });
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      alert(`✅ Added ${quantity} x ${product.name} to cart`);
    } catch (err) {
      console.error('❌ Add to cart failed:', err);
      alert('❌ Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;

    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    };

    localStorage.setItem('singleOrderItem', JSON.stringify(item));
    window.location.href = '/checkout';
  };

  const toggleWishlist = () => {
    const stored = JSON.parse(localStorage.getItem('wishlistItems')) || [];

    const updated = wishlisted
      ? stored.filter((item) => item.productId !== product.id)
      : [...stored, { productId: product.id, name: product.name, image: product.image }];

    localStorage.setItem('wishlistItems', JSON.stringify(updated));
    setWishlisted(!wishlisted);
    alert(wishlisted ? '❌ Removed from Wishlist' : '❤️ Added to Wishlist');
  };

  const submitReview = () => {
    if (!review.trim()) return;

    const updated = [...reviews, { comment: review.trim() }];
    setReviews(updated);
    setReview('');

    const stored = JSON.parse(localStorage.getItem('productReviews')) || {};
    stored[productId] = updated;
    localStorage.setItem('productReviews', JSON.stringify(stored));

    alert('✅ Review submitted!');
  };

  if (loading) return <div className="container my-5 text-center">⏳ Loading product details...</div>;
  if (error) return <div className="container my-5 text-danger">{error}</div>;

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Product Image */}
        <div className="col-md-6 text-center position-relative">
          <span
            className="position-absolute top-0 end-0 m-3 fs-4"
            role="button"
            style={{ color: wishlisted ? 'red' : '#ccc', cursor: 'pointer' }}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            onClick={toggleWishlist}
          >
            {wishlisted ? '❤️' : '🤍'}
          </span>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '450px', objectFit: 'cover' }}
            />
          ) : (
            <div className="bg-light border rounded p-5">No Image Available</div>
          )}
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2 className="fw-bold mb-3">{product.name}</h2>

          <p className="fs-4 text-success fw-semibold">{formatCurrency(product.price)}</p>

          {product.discount > 0 && (
            <p className="text-warning fw-bold">{product.discount}% OFF</p>
          )}

          <p className="text-muted">📦 Category: {product.category || 'N/A'}</p>

          <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'} mb-3`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>

          <p className="mb-4">{product.description || 'No description available.'}</p>

          {/* Quantity */}
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              className="form-control w-25"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || '1')))}
            />
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-3">
            <button
              className="btn btn-primary"
              disabled={adding || product.stock <= 0}
              onClick={handleAddToCart}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              className="btn btn-success"
              disabled={product.stock <= 0}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-5">
        <h4>📝 Reviews</h4>
        <ul className="list-group mb-3">
          {reviews.length === 0 ? (
            <li className="list-group-item text-muted">No reviews yet.</li>
          ) : (
            reviews.map((rev, idx) => (
              <li key={idx} className="list-group-item">
                {rev.comment || rev}
              </li>
            ))
          )}
        </ul>

        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <button className="btn btn-outline-secondary" onClick={submitReview}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
