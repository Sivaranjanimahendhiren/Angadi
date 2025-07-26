import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const user = await getCurrentUser();
      const userId = user?.username || user?.userId || '';
      if (!userId) return setOrders([]);

      const ordersRes = await client.graphql({
        query: /* GraphQL */ `
          query OrdersByUserId($userId: String!) {
            ordersByUserId(userId: $userId) {
              items {
                id
                totalPrice
                status
                createdAt
              }
            }
          }
        `,
        variables: { userId }
      });

      const ordersList = ordersRes.data.ordersByUserId.items || [];

      const ordersWithItems = await Promise.all(
        ordersList.map(async order => {
          const itemsRes = await client.graphql({
            query: /* GraphQL */ `
              query OrderItemsByOrderId($orderId: ID!) {
                orderItemsByOrderId(orderId: $orderId) {
                  items {
                    id
                    name
                    image
                    price
                    quantity
                  }
                }
              }
            `,
            variables: { orderId: order.id }
          });
          const items = itemsRes.data.orderItemsByOrderId.items;
          return { ...order, items };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setOrders([]);
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>📦 Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#fefefe',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
              onClick={() =>
                setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
              }
            >
              <strong>Order ID:</strong> {order.id} <br />
              <strong>Total:</strong> ₹{order.totalPrice.toFixed(2)} <br />
              <strong>Status:</strong> {order.status} <br />
              <strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()} <br />
              <span style={{ color: '#007BFF', fontStyle: 'italic' }}>
                {expandedOrderId === order.id ? 'Hide details ▲' : 'Show details ▼'}
              </span>
            </div>

            {expandedOrderId === order.id && (
              <div
                style={{
                  marginTop: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                {order.items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: '#f9f9f9',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                        borderRadius: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                    <div><strong>{item.name}</strong></div>
                    <div>Price: ₹{item.price}</div>
                    <div>Qty: {item.quantity}</div>
                    <div style={{ fontWeight: 'bold', marginTop: '0.25rem' }}>
                      Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
