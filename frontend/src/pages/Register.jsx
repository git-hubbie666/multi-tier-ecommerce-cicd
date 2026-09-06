import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import ErrorMessage from '../components/ErrorMessage';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const res = await api.register(form);
      window.localStorage.setItem('shopease_token', res.data.token);
      window.localStorage.setItem('shopease_user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setStatus('idle');
    }
  }

  return (
    <div className="section auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>
        {error && <ErrorMessage message={error} />}
        <button type="submit" className="btn-primary full-width" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Creating account...' : 'Register'}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}
