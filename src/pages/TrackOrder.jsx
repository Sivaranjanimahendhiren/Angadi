import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

const formatDate = (str) =>
  new Date(str).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    const trimmed = orderId.trim();
    if (!trimmed) {
      setOrder(null);
      setItems([]);
      setError('⚠️ Please enter a valid Order ID.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Fetch order
      const orderRes = await client.graphql({
        query: /* GraphQL */ `
          query GetOrder($id: ID!) {
            getOrder(id: $id) {
              id
              userId
              status
              totalPrice
              createdAt
            }
          }
        `,
        variables: { id: trimmed }
      });

      const ord = orderRes?.data?.getOrder;
      if (!ord) {
        setError('❌ Order not found. Please double-check the Order ID.');
        setOrder(null);
        setItems([]);
        return;
      }

      // Fetch order items
      const itemsRes = await client.graphql({
        query: /* GraphQL */ `
          query OrderItemsByOrderId($orderId: ID!) {
            orderItemsByOrderId(orderId: $orderId) {
              items {
                id
                name
                quantity
                price
                image
              }
            }
          }
        `,
        variables: { orderId: ord.id }
      });

      const itemList = itemsRes?.data?.orderItemsByOrderId?.items || [];

      setOrder(ord);
      setItems(itemList);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
      setOrder(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">🚚 Track Your Order</h2>

      <div className="mb-3">
        <label htmlFor="orderId" className="form-label">Enter Order ID:</label>
        <input
          id="orderId"
          type="text"
          className="form-control"
          placeholder="e.g. c98a1234-56ff-7890-xxxx-yyyyy"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </div>

      <button className="btn btn-primary w-100" onClick={handleTrack} disabled={loading}>
        {loading ? 'Searching...' : '🔍 Track Order'}
      </button>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {order && (
        <div className="alert alert-success mt-4">
          <h5 className="mb-3">✅ Order Found!</h5>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Placed On:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Total Amount:</strong> {formatCurrency(order.totalPrice)}</p>

          {items.length > 0 && (
            <>
              <p><strong>Items:</strong></p>
              <ul className="mb-0">
                {items.map((item, idx) => (
                  <li key={idx}>
                    <img
                      src={item.image || 'https://via.placeholder.com/40'}
                      alt={item.name}
                      style={{ width: 40, height: 40, marginRight: 8, objectFit: 'cover' }}
                    />
                    {item.name} × {item.quantity} — ₹{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
