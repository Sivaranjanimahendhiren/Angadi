import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { createOrder } from '../graphql/mutations';

const client = generateClient();

const Checkout = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState({ name: '', street: '', city: '', zip: '' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const single = localStorage.getItem('singleOrderItem');
    const multiple = localStorage.getItem('checkoutItems');

    try {
      if (single) {
        setOrderItems([JSON.parse(single)]);
      } else if (multiple) {
        setOrderItems(JSON.parse(multiple));
      }
    } catch (err) {
      console.error("❌ Error parsing checkout data:", err);
    }
  }, []);

  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePaymentChange = (e) =>
    setPayment({ ...payment, [e.target.name]: e.target.value });

  const validateCardNumber = (num) => /^[0-9\s]{13,19}$/.test(num);
  const validateExpiry = (exp) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
  const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!orderItems || orderItems.length === 0) return alert('❌ No product(s) selected for order.');

    const { name, street, city, zip } = address;
    const { cardNumber, expiry, cvv } = payment;

    if (!name || !street || !city || !zip) return alert('❌ Please fill all shipping fields.');
    if (!cardNumber || !expiry || !cvv) return alert('❌ Please fill all payment fields.');
    if (!validateCardNumber(cardNumber)) return alert('❌ Invalid card number.');
    if (!validateExpiry(expiry)) return alert('❌ Expiry must be in MM/YY format.');
    if (!validateCVV(cvv)) return alert('❌ CVV must be 3 or 4 digits.');

    setLoading(true);
    try {
      const user = await getCurrentUser();
      const uid = user?.username || user?.signInDetails?.loginId || user?.userId || 'unknown_user';
      const timestamp = Date.now();

      const orderBatch = orderItems.map((item, idx) => {
        const quantity = parseInt(item.quantity || 1);
        const price = parseFloat(item.price || 0);
        return {
          userId: uid,
          orderId: `ORD-${timestamp}-${idx + 1}`,
          status: 'Confirmed',
          items: [item],
          shippingTo: address,
          total: quantity * price,
          createdAt: new Date().toISOString(),
        };
      });

      for (const order of orderBatch) {
        await client.graphql({
          query: createOrder,
          variables: { input: order },
        });
      }

      localStorage.removeItem('singleOrderItem');
      localStorage.removeItem('checkoutItems');
      setOrderItems([]);
      setAddress({ name: '', street: '', city: '', zip: '' });
      setPayment({ cardNumber: '', expiry: '', cvv: '' });

      alert(`✅ Order placed successfully!\nThank you, ${name}!`);
    } catch (error) {
      console.error('❌ Order submission error:', error);
      alert('❌ Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = orderItems.reduce((sum, item) => {
    const quantity = parseInt(item?.quantity || 1);
    const price = parseFloat(item?.price || 0);
    return sum + quantity * price;
  }, 0);

  return (
    <div className="container my-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">🧾 Checkout</h2>

      {orderItems.length > 0 ? (
        orderItems.map((item, idx) => (
          <div key={idx} className="card mb-4 shadow-sm">
            <div className="row g-0">
              {item.image && (
                <div className="col-md-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded-start"
                    style={{ objectFit: 'cover', height: '100%' }}
                  />
                </div>
              )}
              <div className="col p-3">
                <h5 className="card-title">🛍️ Order Summary</h5>
                <p className="mb-1"><strong>Product:</strong> {item?.name}</p>
                <p className="mb-1"><strong>Price:</strong> ₹{(item?.price || 0).toFixed(2)}</p>
                <p className="mb-0"><strong>Quantity:</strong> {item?.quantity || 1}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-warning text-center" role="alert">
          ⚠️ No item(s) found to checkout. Please go back and select a product using "Buy Now" or Cart.
        </div>
      )}

      {orderItems.length > 0 && (
        <form onSubmit={handlePlaceOrder} noValidate>
          <h4 className="mb-3">📦 Shipping Address</h4>
          {['name', 'street', 'city', 'zip'].map((field) => (
            <div className="mb-3" key={field}>
              <label htmlFor={field} className="form-label text-capitalize">{field}</label>
              <input
                id={field}
                name={field}
                type="text"
                className="form-control"
                placeholder={field === 'zip' ? 'ZIP Code' : `Enter ${field}`}
                value={address[field]}
                onChange={handleAddressChange}
                required
              />
            </div>
          ))}

          <h4 className="mb-3">💳 Payment Details</h4>

          <div className="mb-3">
            <label htmlFor="cardNumber" className="form-label">Card Number</label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              className="form-control"
              placeholder="Card Number"
              value={payment.cardNumber}
              onChange={handlePaymentChange}
              maxLength={19}
              inputMode="numeric"
              required
            />
          </div>

          <div className="row mb-4">
            <div className="col">
              <label htmlFor="expiry" className="form-label">Expiry (MM/YY)</label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                className="form-control"
                placeholder="MM/YY"
                value={payment.expiry}
                onChange={handlePaymentChange}
                maxLength={5}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="cvv" className="form-label">CVV</label>
              <input
                id="cvv"
                name="cvv"
                type="password"
                className="form-control"
                placeholder="CVV"
                value={payment.cvv}
                onChange={handlePaymentChange}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="mb-3 text-end">
            <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Processing...' : '✅ Place Order'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Checkout;
