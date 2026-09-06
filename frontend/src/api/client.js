const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message = body?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.errors = body?.errors;
    throw error;
  }

  return body;
}

export const api = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request('/categories'),
  validateCart: (items) => request('/cart/validate', { method: 'POST', body: JSON.stringify({ items }) }),
  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrder: (id) => request(`/orders/${id}`),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
};

export { API_BASE_URL };
