import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from '@aws-amplify/auth';
import {
  createCartItem,
  createWishlistItem,
  deleteWishlistItem,
  createReview,
  createBid,
  createOrder,
  createOrderItem
} from '../graphql/mutations';
import { getProduct } from '../graphql/queries';

const client = generateClient();

const RecommendedSection = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('guest');
  const [wishlist, setWishlist] = useState({});
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [reviewModal, setReviewModal] = useState({ show: false, product: null, rating: '', comment: '' });
  const [bidModal, setBidModal] = useState({ show: false, product: null, amount: '' });

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        const uid = user?.userId || user?.username || 'guest';
        setUserId(uid);

        const res = await fetch('http://127.0.0.1:5001/recommend');
        const json = await res.json();
        const recommendedList = json?.RecommendedProducts || [];
        const detailedProducts = [];

        for (const item of recommendedList) {
          try {
            const { data } = await client.graphql({
              query: getProduct,
              variables: { id: item.productId }
            });
            const product = data?.getProduct;
            if (product) {
              detailedProducts.push({
                id: product.id,
                name: product.name,
                image: product.image || '/placeholder.png',
                price: product.price || 0,
                description: product.description,
                discount: product.discount,
                score: item.score
              });
            }
          } catch (err) {
            console.warn(`Failed to fetch product ${item.productId}`, err);
          }
        }

        setRecommendedProducts(detailedProducts);
      } catch (err) {
        console.error('Error loading recommendations:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    } catch (err) {
      alert('❌ Failed to add to cart');
    }
  };

  const buyNow = async (product) => {
    const quantity = parseInt(prompt(`Quantity for ${product.name}:`, '1'));
    if (!quantity || quantity <= 0) return alert('Invalid quantity');

    const totalPrice = parseFloat(product.price) * quantity;

    try {
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

      alert('✅ Order placed!');
    } catch (err) {
      alert('❌ Order failed');
    }
  };

  const toggleWishlist = async (product) => {
    const isWished = !!wishlist[product.id];
    try {
      if (isWished) {
        await client.graphql({
          query: deleteWishlistItem,
          variables: { input: { id: wishlist[product.id] } }
        });
        const updated = { ...wishlist };
        delete updated[product.id];
        setWishlist(updated);
      } else {
        const res = await client.graphql({
          query: createWishlistItem,
          variables: {
            input: {
              userId,
              productId: product.id,
              addedAt: new Date().toISOString()
            }
          }
        });
        const id = res?.data?.createWishlistItem?.id;
        if (id) setWishlist((w) => ({ ...w, [product.id]: id }));
      }
    } catch (err) {
      console.error('Wishlist toggle failed', err);
    }
  };

  const submitReview = async () => {
    const r = reviewModal;
    if (!r.rating || !r.comment.trim()) return alert('Fill in all fields');
    try {
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
      alert('✅ Review submitted!');
      setReviewModal({ show: false, product: null, rating: '', comment: '' });
    } catch (err) {
      alert('❌ Review failed');
    }
  };

  const submitBid = async () => {
    const amount = parseFloat(bidModal.amount);
    if (!amount || amount <= 0) return alert('Enter valid bid amount');

    try {
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
    } catch (err) {
      alert('❌ Bid failed');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>🎯 Recommended for You</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 24
      }}>
        {recommendedProducts.map(p => (
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
                src={p.image}
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

export default RecommendedSection;
