import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(search.trim() ? `/products?search=${encodeURIComponent(search.trim())}` : '/products');
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Shop<span>Ease</span>
        </Link>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>

        <nav className="nav-links">
          <Link to="/products">Shop</Link>
          <Link to="/login">Login</Link>
          <Link to="/cart" className="cart-link">
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
