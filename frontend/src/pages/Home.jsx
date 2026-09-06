import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState('loading');

  async function load() {
    setStatus('loading');
    try {
      const [catRes, prodRes] = await Promise.all([
        api.getCategories(),
        api.getProducts({ limit: 8 }),
      ]);
      setCategories(catRes.data);
      setFeatured(prodRes.data);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Everything you need, delivered with ease.</h1>
          <p>Discover electronics, fashion, home essentials and more — all in one place.</p>
          <Link to="/products" className="btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Shop by Category</h2>
        {status === 'loading' && <Loading label="Loading categories..." />}
        {status === 'error' && <ErrorMessage message="Could not load categories." onRetry={load} />}
        {status === 'ready' && (
          <div className="category-grid">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`} className="category-tile">
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Featured Products</h2>
        {status === 'loading' && <Loading label="Loading products..." />}
        {status === 'error' && <ErrorMessage message="Could not load products." onRetry={load} />}
        {status === 'ready' && (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
