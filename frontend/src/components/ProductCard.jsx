import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image">
        <img src={product.image_url} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <span className="product-category">{product.category_name}</span>
        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="product-card-footer">
          <span className="price">₹{Number(product.price).toLocaleString('en-IN')}</span>
          <button
            className="btn-add"
            onClick={() => addItem(product, 1)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
