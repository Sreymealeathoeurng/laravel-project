import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../assets/styling/signup.scss'
import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBSpinner,
  MDBIcon
} from 'mdb-react-ui-kit';

const SignupForm = () => {
  const { signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reader',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = 'Include uppercase, lowercase, and number';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.termsAccepted)
      newErrors.termsAccepted = 'You must accept the Terms and Conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    const payload = {
      ...formData,
      password_confirmation: formData.confirmPassword,
    };

    delete payload.confirmPassword;

    try {
      await signup(payload);
      setSuccessMessage('Account created successfully! Redirecting...');
      // Redirect all users to login page after successful signup
      navigate('/login', {
        state: {
          fromSignup: true,
          message: 'Account created successfully! Please verify your email before logging in.',
        },
      });
    } catch (err) {
      console.error('Signup error:', err);

      if (err.response?.status === 422 && err.response.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({
          server: err.response?.data?.message || 'Signup failed. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
    <div className="signup-card">
      <div className="card-body">
        <div className="text-center mb-5">
          <div className="d-flex justify-content-center mb-4">
            <div className="icon-circle">
              <i className="fas fa-user-plus"></i>
            </div>
          </div>
          <h2>Create Your Account</h2>
          <p className="subtitle">Join our community of readers and authors</p>
        </div>

        {successMessage && (
          <div className="alert success">{successMessage}</div>
        )}
        {errors.server && <div className="alert error">{errors.server}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <div className={`input-container ${errors.name ? 'error' : ''}`}>
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className={`input-container ${errors.email ? 'error' : ''}`}>
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <div className={`input-container ${errors.password ? 'error' : ''}`}>
             
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className={`input-container ${errors.confirmPassword ? 'error' : ''}`}>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
          </div>

          <div className="password-info">
            <i className="fas fa-info-circle"></i>
            <span>Password must be at least 8 characters with uppercase, lowercase, and number</span>
          </div>

          <div className="role-selection">
            <label>I want to join as:</label>
            <div className="role-options">
              {['reader', 'author'].map((role) => (
                <div
                  key={role}
                  className={`role-card ${formData.role === role ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, role }))}
                >
                  <div className="icon-wrapper">
                    <i className={`fas ${role === 'reader' ? 'fa-book-reader' : 'fa-pen-fancy'}`}></i>
                  </div>
                  <span className="role-name">{role}</span>
                  <small className="role-description">
                    {role === 'reader' ? 'Browse and enjoy content' : 'Create and share content'}
                  </small>
                </div>
              ))}
            </div>
          </div>

          <div className="terms-container">
            <div className="form-check">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className={errors.termsAccepted ? 'error' : ''}
              />
              <label htmlFor="termsAccepted">
                I agree to the <a href="#!">Terms and Conditions</a>
              </label>
            </div>
            {errors.termsAccepted && <div className="error-message">{errors.termsAccepted}</div>}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span> Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Sign Up
              </>
            )}
          </button>

          <div className="login-link">
            <p>
              Already have an account?{' '}
              <span onClick={() => navigate('/login')}>
                Log In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default SignupForm;
