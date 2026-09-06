import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');

  async function load() {
    setStatus('loading');
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ search, category }),
        categories.length ? Promise.resolve({ data: categories }) : api.getCategories(),
      ]);
      setProducts(prodRes.data);
      if (!categories.length) setCategories(catRes.data);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  function handleCategoryClick(slug) {
    const params = {};
    if (search) params.search = search;
    if (slug) params.category = slug;
    setSearchParams(params);
  }

  return (
    <div className="section">
      <div className="product-list-header">
        <h1>{search ? `Results for "${search}"` : 'All Products'}</h1>
        <div className="filter-chips">
          <button
            className={!category ? 'chip active' : 'chip'}
            onClick={() => handleCategoryClick('')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={category === cat.slug ? 'chip active' : 'chip'}
              onClick={() => handleCategoryClick(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {status === 'loading' && <Loading label="Loading products..." />}
      {status === 'error' && <ErrorMessage message="Could not load products." onRetry={load} />}
      {status === 'ready' && products.length === 0 && (
        <div className="empty-state">
          <p>No products matched your search. Try a different keyword or category.</p>
        </div>
      )}
      {status === 'ready' && products.length > 0 && (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
