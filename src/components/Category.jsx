import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from '@aws-amplify/auth';
import { listProducts } from '../graphql/queries';
import {
  createCartItem,
  createOrder,
  createOrderItem,
  createWishlistItem,
  deleteWishlistItem,
  createReview,
  createBid
} from '../graphql/mutations';

const client = generateClient();

const Category = () => {
  const [categories, setCategories] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [userId, setUserId] = useState('');
  const [wishlist, setWishlist] = useState({});
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [reviewModal, setReviewModal] = useState({ show: false, product: null, rating: '', comment: '' });
  const [bidModal, setBidModal] = useState({ show: false, product: null, amount: '' });

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user?.userId || user?.username || 'guest');
      } catch {
        setUserId('guest');
      }

      try {
        const res = await client.graphql({ query: listProducts });
        const items = res?.data?.listProducts?.items || [];
        const grouped = items.reduce((acc, product) => {
          const cat = (product.category || 'others').toLowerCase();
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(product);
          return acc;
        }, {});
        setCategories(grouped);
        setActiveCategory(Object.keys(grouped)[0]);
      } catch (err) {
        console.error('❌ Failed to load products:', err);
      }
    })();
  }, []);

  const run = async (mutation, variables, msg) => {
    try {
      const res = await client.graphql({ query: mutation, variables });
      alert(msg);
      return res;
    } catch (err) {
      alert(`❌ ${msg} failed: ${err.errors?.[0]?.message || 'Unknown error'}`);
    }
  };

  const addToCart = async (product) => {
    await run(createCartItem, {
      input: {
        userId,
        productId: product.id,
        quantity: 1,
        addedAt: new Date().toISOString()
      }
    }, `Added ${product.name} to cart`);
  };

  const buyNow = async (product) => {
    const quantity = parseInt(prompt(`Quantity for ${product.name}:`, '1'));
    if (!quantity || quantity <= 0) return alert('Invalid quantity');

    const totalPrice = parseFloat(product.price) * quantity;
    const orderRes = await run(createOrder, {
      input: { userId, totalPrice, status: 'Pending' }
    }, `Created order for ${product.name}`);

    const orderId = orderRes?.data?.createOrder?.id;
    if (!orderId) return;

    await run(createOrderItem, {
      input: {
        orderId,
        productId: product.id,
        name: product.name,
        image: product.image || '',
        price: parseFloat(product.price),
        quantity
      }
    }, `Order item added`);
  };

  const toggleWishlist = async (product) => {
    if (wishlist[product.id]) {
      await run(deleteWishlistItem, { input: { id: wishlist[product.id] } }, `Removed ${product.name} from wishlist`);
      const updated = { ...wishlist };
      delete updated[product.id];
      setWishlist(updated);
    } else {
      const res = await run(createWishlistItem, {
        input: { userId, productId: product.id, addedAt: new Date().toISOString() }
      }, `Added ${product.name} to wishlist`);
      const id = res?.data?.createWishlistItem?.id;
      if (id) setWishlist(w => ({ ...w, [product.id]: id }));
    }
  };

  const submitReview = () => {
    const r = reviewModal;
    if (!r.rating || !r.comment.trim()) return alert('Fill in all fields');

    run(createReview, {
      input: {
        productID: r.product.id,
        rating: parseInt(r.rating),
        comment: r.comment
      }
    }, `Review added`);

    setReviewModal({ show: false, product: null, rating: '', comment: '' });
  };

  const submitBid = async () => {
    const amount = parseFloat(bidModal.amount);
    if (!amount || amount <= 0) return alert('Enter valid bid amount');

    await run(createBid, {
      input: {
        productId: bidModal.product.id,
        userId,
        amount,
        status: 'Pending'
      }
    }, `Bid ₹${amount} placed on ${bidModal.product.name}`);

    setBidModal({ show: false, product: null, amount: '' });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 className="text-center mb-4">📦 Shop by Category</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: 24, justifyContent: 'center' }}>
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid #ddd',
              background: activeCategory === cat ? '#222' : '#fff',
              color: activeCategory === cat ? '#fff' : '#000',
              cursor: 'pointer'
            }}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)} ({categories[cat].length})
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 24
      }}>
        {(categories[activeCategory] || []).map((p) => (
          <div key={p.id}
            onClick={() => setActiveOverlay(activeOverlay === p.id ? null : p.id)}
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
              onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
              style={{
                position: 'absolute',
                top: 12,
                right: 14,
                fontSize: 24,
                cursor: 'pointer',
                color: wishlist[p.id] ? 'red' : '#aaa',
                zIndex: 11
              }}>
              {wishlist[p.id] ? '♥' : '♡'}
            </span>

            {activeOverlay === p.id && (
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
                gap: '2px',
                zIndex: 10,
                padding: '20px'
              }}>
                <button style={shutterBtnDark} onClick={(e) => { e.stopPropagation(); addToCart(p); }}>Add to Cart</button>
                <button style={shutterBtnDark} onClick={(e) => { e.stopPropagation(); buyNow(p); }}>Buy Now</button>
                <button style={shutterBtnDark} onClick={(e) => { e.stopPropagation(); setReviewModal({ show: true, product: p, rating: '', comment: '' }); }}>Write Review</button>
                <button style={shutterBtnDark} onClick={(e) => { e.stopPropagation(); setBidModal({ show: true, product: p, amount: '' }); }}>Place Bid</button>
              </div>
            )}

            <div style={{ height: '240px', width: '100%', overflow: 'hidden' }}>
              <img
                src={p.image || 'https://via.placeholder.com/300x240?text=No+Image'}
                alt={p.name}
                style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>

            <div style={{ padding: '14px 16px' }}>
              <h5 style={{ margin: '0 0 4px' }}>{p.name}</h5>
              <div style={{ fontWeight: 'bold', color: '#222' }}>
                ₹{p.price?.toFixed(2)}{' '}
                {p.discount && <small style={{ color: 'green' }}>(-{p.discount}%)</small>}
              </div>
              <div style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.description}
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default Category;
