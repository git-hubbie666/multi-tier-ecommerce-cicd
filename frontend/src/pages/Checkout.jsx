import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';
import ErrorMessage from '../components/ErrorMessage';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ customerName: '', customerEmail: '', shippingAddress: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      };
      const res = await api.createOrder(payload);
      clearCart();
      navigate(`/order-confirmation/${res.data.orderId}`);
    } catch (err) {
      setError(err.message || 'Could not place your order. Please try again.');
      setStatus('idle');
    }
  }

  return (
    <div className="section">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input name="customerName" value={form.customerName} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input
              type="email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Shipping Address
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              required
              rows={4}
            />
          </label>

          <p className="note">Payment is simulated for this project — no real charge will be made.</p>

          {error && <ErrorMessage message={error} />}

          <button type="submit" className="btn-primary full-width" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Placing order...' : `Place Order — ₹${subtotal.toLocaleString('en-IN')}`}
          </button>
        </form>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          {items.map((item) => (
            <div key={item.productId} className="summary-row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
