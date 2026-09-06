import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');

  async function load() {
    setStatus('loading');
    try {
      const res = await api.getOrder(id);
      setOrder(res.data);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (status === 'loading') return <Loading label="Loading your order..." />;
  if (status === 'error') return <ErrorMessage message="Could not find this order." onRetry={load} />;

  return (
    <div className="section order-confirmation">
      <div className="confirmation-icon">✓</div>
      <h1>Thank you, {order.customer_name}!</h1>
      <p>Your order has been placed successfully.</p>
      <p className="order-id">Order #{order.id}</p>

      <div className="cart-summary confirmation-summary">
        {order.items.map((item) => (
          <div key={item.id} className="summary-row">
            <span>
              {item.product_name} × {item.quantity}
            </span>
            <span>₹{(Number(item.unit_price) * item.quantity).toLocaleString('en-IN')}</span>
          </div>
        ))}
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <p className="note">Shipping to: {order.shipping_address}</p>

      <Link to="/products" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}
