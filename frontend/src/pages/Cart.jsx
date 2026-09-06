import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="section empty-state">
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="section">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <img src={item.image_url} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="price">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
              </div>
              <p className="line-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              <button className="btn-remove" onClick={() => removeItem(item.productId)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <button className="btn-primary full-width" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
