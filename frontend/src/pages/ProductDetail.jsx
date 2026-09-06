import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('loading');
  const [added, setAdded] = useState(false);

  async function load() {
    setStatus('loading');
    try {
      const res = await api.getProduct(id);
      setProduct(res.data);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  }

  useEffect(() => {
    load();
    setQuantity(1);
    setAdded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (status === 'loading') return <Loading label="Loading product..." />;
  if (status === 'error') return <ErrorMessage message="Could not load this product." onRetry={load} />;
  if (!product) return null;

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
  }

  return (
    <div className="section product-detail">
      <button className="btn-link" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="product-category">{product.category_name}</span>
          <h1>{product.name}</h1>
          <p className="price">₹{Number(product.price).toLocaleString('en-IN')}</p>
          <p className="description">{product.description}</p>
          <p className={product.stock > 0 ? 'stock in-stock' : 'stock out-of-stock'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {product.stock > 0 && (
            <div className="quantity-row">
              <label htmlFor="qty">Quantity</label>
              <div className="quantity-control">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(product.stock, Math.max(1, Number(e.target.value) || 1)))
                  }
                />
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <button className="btn-primary" onClick={handleAdd} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
          {added && <p className="success-text">Added to cart ✓</p>}
        </div>
      </div>
    </div>
  );
}
