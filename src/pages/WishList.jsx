import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import {
  deleteWishlistItem,
  createCartItem,
  createOrder,
  createOrderItem,
  createReview,
  createBid
} from '../graphql/mutations';

const client = generateClient();

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [reviewModal, setReviewModal] = useState({ show: false, product: null, rating: '', comment: '' });
  const [bidModal, setBidModal] = useState({ show: false, product: null, amount: '' });

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const id = user?.username || user?.userId || 'guest';
      setUserId(id);

      const res = await client.graphql({
        query: /* GraphQL */ `
          query WishlistItemsByUserId($userId: String!) {
            wishlistItemsByUserId(userId: $userId) {
              items {
                id
                product {
                  id
                  name
                  price
                  stock
                  image
                  description
                  category
                }
              }
            }
          }
        `,
        variables: { userId: id }
      });

      const items = res?.data?.wishlistItemsByUserId?.items || [];
      const enriched = items.filter(i => i.product).map(i => ({
        wishlistItemId: i.id,
        ...i.product
      }));

      setWishlist(enriched);
    } catch (err) {
      console.error(err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const removeFromWishlist = async (id) => {
    try {
      await client.graphql({
        query: deleteWishlistItem,
        variables: { input: { id } }
      });
      setWishlist(w => w.filter(item => item.wishlistItemId !== id));
    } catch {
      alert('Failed to remove from wishlist');
    }
  };

  const addToCart = async (product) => {
    try {
      await client.graphql({
        query: createCartItem,
        variables: {
          input: {
            userId,
            productId: product.id,
            quantity: 1,
            addedAt: new Date().toISOString()
          }
        }
      });
      alert(`✅ Added ${product.name} to cart`);
    } catch {
      alert('Already in cart or an error occurred');
    }
  };

  const buyNow = async (product) => {
    const quantity = parseInt(prompt(`Quantity for ${product.name}:`, '1'));
    if (!quantity || quantity <= 0) return alert('Invalid quantity');

    const totalPrice = parseFloat(product.price) * quantity;

    const orderRes = await client.graphql({
      query: createOrder,
      variables: {
        input: { userId, totalPrice, status: 'Pending' }
      }
    });

    const orderId = orderRes?.data?.createOrder?.id;
    if (!orderId) return;

    await client.graphql({
      query: createOrderItem,
      variables: {
        input: {
          orderId,
          productId: product.id,
          name: product.name,
          image: product.image || '',
          price: parseFloat(product.price),
          quantity
        }
      }
    });

    alert(`✅ Order placed for ${product.name}`);
  };

  const submitReview = async () => {
    const r = reviewModal;
    if (!r.rating || !r.comment.trim()) return alert('Fill in all fields');

    await client.graphql({
      query: createReview,
      variables: {
        input: {
          productID: r.product.id,
          rating: parseInt(r.rating),
          comment: r.comment
        }
      }
    });

    alert('✅ Review added');
    setReviewModal({ show: false, product: null, rating: '', comment: '' });
  };

  const submitBid = async () => {
    const amount = parseFloat(bidModal.amount);
    if (!amount || amount <= 0) return alert('Enter valid bid amount');

    await client.graphql({
      query: createBid,
      variables: {
        input: {
          productId: bidModal.product.id,
          userId,
          amount,
          status: 'Pending'
        }
      }
    });

    alert(`✅ Bid ₹${amount} placed on ${bidModal.product.name}`);
    setBidModal({ show: false, product: null, amount: '' });
  };

  if (loading) return <div style={{ padding: 20 }}>Loading wishlist...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>❤️ Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24
        }}>
          {wishlist.map(product => (
            <div key={product.id}
              onClick={() => setActiveOverlay(activeOverlay === product.id ? null : product.id)}
              style={{
                border: '1px solid #ddd',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                position: 'relative',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}>

              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(product.wishlistItemId);
                }}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 14,
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'red',
                  zIndex: 11
                }}>
                ♥
              </span>

              {activeOverlay === product.id && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  placeItems: 'center',
                  gap: 4,
                  padding: 20,
                  zIndex: 10
                }}>
                  <button style={shutterBtnDark} onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
                  <button style={shutterBtnDark} onClick={(e) => { e.stopPropagation(); buyNow(product); }}>Buy Now</button>
                  <button style={shutterBtnDark} onClick={(e) => { e.stopPropagation(); setReviewModal({ show: true, product, rating: '', comment: '' }); }}>Write Review</button>
                  <button style={shutterBtnDark} onClick={(e) => { e.stopPropagation(); setBidModal({ show: true, product, amount: '' }); }}>Place Bid</button>
                </div>
              )}

              <div style={{ height: '240px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={product.image || 'https://via.placeholder.com/300x240?text=No+Image'}
                  alt={product.name}
                  style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'center' }}
                />
              </div>

              <div style={{ padding: '14px 16px' }}>
                <h5 style={{ margin: '0 0 4px' }}>{product.name}</h5>
                <div style={{ fontWeight: 'bold', color: '#222' }}>
                  ₹{product.price?.toFixed(2)}
                </div>
                <div style={{ fontSize: 13, color: '#666' }}>
                  {product.category} | Stock: {product.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewModal.show && (
        <Modal onClose={() => setReviewModal({ show: false })}>
          <h4>Review: {reviewModal.product.name}</h4>
          <input type="number" placeholder="Rating (1-5)" min={1} max={5}
            value={reviewModal.rating} onChange={e => setReviewModal(r => ({ ...r, rating: e.target.value }))} style={modalInput} />
          <textarea placeholder="Your thoughts..." value={reviewModal.comment}
            onChange={e => setReviewModal(r => ({ ...r, comment: e.target.value }))} style={modalInput} />
          <button onClick={submitReview}>Submit</button>
        </Modal>
      )}

      {bidModal.show && (
        <Modal onClose={() => setBidModal({ show: false })}>
          <h4>Bid on: {bidModal.product.name}</h4>
          <input type="number" placeholder="Amount in ₹" value={bidModal.amount}
            onChange={e => setBidModal(b => ({ ...b, amount: e.target.value }))} style={modalInput} />
          <button onClick={submitBid}>Place Bid</button>
        </Modal>
      )}
    </div>
  );
};

const shutterBtnDark = {
  fontSize: 14,
  padding: '10px 8px',
  backgroundColor: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: 2,
  cursor: 'pointer',
  width: '100%',
  height: '100%',
  fontWeight: '600',
  color: '#fff',
  textAlign: 'center',
  boxSizing: 'border-box'
};

const modalInput = {
  width: '100%',
  margin: '10px 0',
  padding: 8,
  fontSize: 14
};

const Modal = ({ children, onClose }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
  }} onClick={onClose}>
    <div style={{ background: '#fff', padding: 24, borderRadius: 8, width: 340 }} onClick={e => e.stopPropagation()}>
      {children}
      <button onClick={onClose} style={{ marginTop: 14 }}>Cancel</button>
    </div>
  </div>
);

export default Wishlist;
