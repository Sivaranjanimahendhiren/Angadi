import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import {
  createOrder,
  createOrderItem,
  deleteCartItem,
  updateCartItem
} from '../graphql/mutations';

const client = generateClient();

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const id = user?.username || user?.userId || '';
      setUserId(id);

      const res = await client.graphql({
        query: /* GraphQL */ `
          query CartItemsByUserId($userId: String!) {
            cartItemsByUserId(userId: $userId) {
              items {
                id
                quantity
                product {
                  id
                  name
                  price
                  stock
                  image
                }
              }
            }
          }
        `,
        variables: { userId: id }
      });

      const items = res?.data?.cartItemsByUserId?.items || [];
      const enriched = items
        .filter(i => i.product)
        .map(i => ({
          cartItemId: i.id,
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          stock: i.product.stock,
          image: i.product.image || '/placeholder.png'
        }));

      setCartItems(enriched);
    } catch (e) {
      console.error(e);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = +(subtotal * 0.05).toFixed(2);
  const delivery = subtotal ? 50 : 0;
  const total = +(subtotal + tax + delivery).toFixed(2);

  const changeQty = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > item.stock) return;
    try {
      await client.graphql({
        query: updateCartItem,
        variables: { input: { id: item.cartItemId, quantity: newQty } }
      });
      setCartItems(cs =>
        cs.map(ci => ci.cartItemId === item.cartItemId ? { ...ci, quantity: newQty } : ci)
      );
    } catch {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (cid) => {
    await client.graphql({ query: deleteCartItem, variables: { input: { id: cid } } });
    setCartItems(cs => cs.filter(c => c.cartItemId !== cid));
  };

  const placeOrder = async () => {
    if (!userId) return alert('Sign in first');
    if (!cartItems.length) return alert('Cart is empty');
    if (!window.confirm(`Place order for ₹${total}?`)) return;

    setPlacing(true);
    try {
      const res = await client.graphql({
        query: createOrder,
        variables: { input: { userId, totalPrice: total, status: 'Confirmed' } }
      });

      const oid = res.data.createOrder.id;

      await Promise.all(cartItems.map(ci =>
        client.graphql({
          query: createOrderItem,
          variables: {
            input: {
              orderId: oid,
              productId: ci.productId,
              name: ci.name,
              image: ci.image,
              price: ci.price,
              quantity: ci.quantity
            }
          }
        })
      ));

      await Promise.all(cartItems.map(ci =>
        client.graphql({
          query: deleteCartItem,
          variables: { input: { id: ci.cartItemId } }
        })
      ));

      setCartItems([]);
      alert('🎉 Order placed!');
    } catch (e) {
      console.error(e);
      alert('Order failed');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading cart...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20
          }}>
            {cartItems.map(item => (
              <div key={item.cartItemId} style={{
                border: '1px solid #ddd',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                gap: 12,
                background: '#fff',
                alignItems: 'center'
              }}>
                <div style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f0f0f0'
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain', // <-- changed from 'cover' to 'contain'
                      display: 'block'
                    }}
                  />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ margin: '4px 0' }}>{item.name}</h4>
                  <div>₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</div>
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => changeQty(item, -1)} disabled={item.quantity === 1}>−</button>
                    <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                    <button onClick={() => changeQty(item, +1)} disabled={item.quantity === item.stock}>+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.cartItemId)} style={{ alignSelf: 'flex-start' }}>🗑</button>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#f8f8f8',
            maxWidth: 400
          }}>
            <div style={{ marginBottom: 8 }}>Subtotal: ₹{subtotal.toFixed(2)}</div>
            <div style={{ marginBottom: 8 }}>Tax (5%): ₹{tax.toFixed(2)}</div>
            <div style={{ marginBottom: 8 }}>Delivery: ₹{delivery.toFixed(2)}</div>
            <div><strong>Total: ₹{total.toFixed(2)}</strong></div>
            <button onClick={placeOrder} disabled={placing}
              style={{
                marginTop: 14,
                padding: '10px 16px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: 6
              }}>
              {placing ? 'Placing…' : '✅ Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
