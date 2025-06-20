import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styling/signup.scss';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
    if (csrfTokenElement) {
      const csrfToken = csrfTokenElement.getAttribute('content');
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });

      const response = await axios.post(
        'http://localhost:8000/api/login',
        { email, password },
        { withCredentials: true }
      );

      const { token, user } = response.data;

      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      navigate(user.role === 'author' ? '/' : '/home');
    } catch (err) {
      setErrors({
        server: err.response?.data?.message || 'Login failed.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
 
      <div className="login-container">
        <div className="login-card">
          <div className="card-body">
            <div className="login-title">
              <h2>Login to Verify Your Account</h2>
            </div>
    
            {errors.server && (
              <div className="alert alert-danger">
                {errors.server}
              </div>
            )}
    
            <form onSubmit={handleLogin} noValidate>
              <div className={`form-group ${errors.email ? 'is-invalid' : ''}`}>
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
    
              <div className={`form-group ${errors.password ? 'is-invalid' : ''}`}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
    
              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span> Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
    
            <div className="signup-link">
              <p>
                Don't have an account?{' '}
                <span onClick={() => navigate('/signup')}>
                  Sign Up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default LoginForm;
