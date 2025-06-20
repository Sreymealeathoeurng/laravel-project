import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './styling/EditBook.scss';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    cover_image: '',
    title: '',
    category_id: '',
    description: '',
    publication_date: '',
    language: 'English',
    is_published: false,
    is_public: true,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        
        // Fetch book data
        const bookRes = await axios.get(`/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch categories
        const categoriesRes = await axios.get('/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBook(bookRes.data);
        setCategories(categoriesRes.data);
        setCoverPreview(bookRes.data.cover_image || '');
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch book:', err);
        
        // Enhanced error handling
        if (err.response) {
          if (err.response.status === 401) {
            setError('Unauthorized: Please login again');
          } else if (err.response.status === 404) {
            setError('Book not found');
          } else {
            setError('Server error: Please try again later');
          }
        } else if (err.request) {
          setError('Network error: Could not connect to server');
        } else {
          setError('Failed to load book data: ' + err.message);
        }
        
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook({
      ...book,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
      
      // Upload to server
      const formData = new FormData();
      formData.append('cover', file);
      
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/upload-cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setBook({ ...book, cover_image: res.data.url });
      setIsUploading(false);
      setSuccessMessage('Cover image uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Cover upload failed:', err);
      
      // Enhanced error handling for cover upload
      if (err.response) {
        if (err.response.status === 413) {
          setError('File too large: Max size is 2MB');
        } else if (err.response.status === 415) {
          setError('Invalid file type: Only JPG/PNG allowed');
        } else {
          setError('Cover upload failed: ' + err.response.data.message);
        }
      } else {
        setError('Cover upload failed: ' + err.message);
      }
      
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      setError('');
  
      const token = localStorage.getItem('token');
  
      // Normalize form data before sending
      const payload = {
        ...book,
        category_id: book.category_id ? Number(book.category_id) : null,
        is_published: Boolean(book.is_published),
        is_public: Boolean(book.is_public),
      };
  
      await axios.put(`/api/books/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setLoading(false);
      setSuccessMessage('Book updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        navigate(`/books/${id}/preview`);
      }, 2000);
    } catch (err) {
      console.error('Update failed:', err);
  
      if (err.response) {
        if (err.response.status === 400) {
          setError('Validation error: ' + err.response.data.message);
        } else if (err.response.status === 403) {
          setError('Forbidden: You cannot edit this book');
        } else {
          setError('Update failed: ' + err.response.data.message);
        }
      } else {
        setError('Update failed: ' + err.message);
      }
  
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      setError('');
      
      const token = localStorage.getItem('token');
      await axios.delete(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/dashboard', {
        state: { success: 'Book deleted successfully!' }
      });
    } catch (err) {
      console.error('Delete failed:', err);
      
      // Enhanced error handling for delete
      if (err.response) {
        if (err.response.status === 403) {
          setError('Forbidden: You cannot delete this book');
        } else if (err.response.status === 404) {
          setError('Book not found');
        } else {
          setError('Delete failed: ' + err.response.data.message);
        }
      } else {
        setError('Delete failed: ' + err.message);
      }
      
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-book-loading">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="edit-book-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="edit-book-header">
        <h1>Edit Book</h1>
        <p>Update your book details and settings</p>
      </div>
      
      <div className="edit-book-content">
        <form onSubmit={handleSubmit}>
          {error && (
            <motion.div 
              className="form-error"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="error-icon">!</div>
              <div className="error-message">{error}</div>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </motion.div>
          )}
          
          {successMessage && (
            <motion.div 
              className="form-success"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="success-icon">✓</div>
              <div className="success-message">{successMessage}</div>
            </motion.div>
          )}
          
          <div className="form-section">
            <h3>Book Cover</h3>
            <div className="cover-upload">
              <div className="cover-preview">
                {coverPreview ? (
                  <img src={coverPreview} alt="Book cover preview" />
                ) : (
                  <div className="cover-placeholder">
                    <div className="book-icon"></div>
                    <span>No cover image</span>
                  </div>
                )}
                {isUploading && <div className="upload-overlay">Uploading...</div>}
              </div>
              <label className="upload-btn">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleCoverChange}
                  disabled={isUploading}
                />
                <span className="upload-icon"></span> 
                {coverPreview ? 'Change Cover' : 'Upload Cover'}
              </label>
              <p className="upload-hint">Recommended size: 600x900 pixels • Max size: 2MB</p>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Book Details</h3>
            <div className="form-group">
              <label>Book Title *</label>
              <input
                type="text"
                name="title"
                value={book.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={book.description}
                onChange={handleChange}
                rows="5"
                placeholder="Enter a brief description of your book..."
                disabled={loading}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category_id"
                  value={book.category_id}
                  onChange={handleChange}
                  disabled={loading || categories.length === 0}
                >
                  <option value="">Select a category</option>
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading categories failed</option>
                  )}
                </select>
              </div>
              
              <div className="form-group">
                <label>Publication Date</label>
                <input
                  type="date"
                  name="publication_date"
                  value={book.publication_date ? book.publication_date.split('T')[0] : ''}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Language</label>
                <select
                  name="language"
                  value={book.language}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <div className="status-display">
                  {book.is_published ? (
                    <span className="status-published">Published</span>
                  ) : (
                    <span className="status-draft">Draft</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Visibility Settings</h3>
            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="is_published"
                  checked={book.is_published}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="checkbox-custom"></span>
                Publish this book
              </label>
              <p className="checkbox-hint">When published, your book will be visible to readers</p>
            </div>
            
            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={book.is_public}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="checkbox-custom"></span>
                Make this book public
              </label>
              <p className="checkbox-hint">Public books can be discovered by all users</p>
            </div>
          </div>
          
          <div className="form-actions">
            <motion.button 
              type="button" 
              className="btn-delete"
              onClick={handleDelete}
              disabled={isDeleting || loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {isDeleting ? (
                <span className="deleting-spinner"></span>
              ) : (
                <span className="trash-icon"></span>
              )}
              Delete Book
            </motion.button>
            
            <div className="action-buttons">
              <motion.button 
                type="button" 
                className="btn-cancel"
                onClick={() => navigate(-1)}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button 
                type="submit" 
                className="btn-save"
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="saving-spinner"></span>
                ) : (
                  <span className="save-icon"></span>
                )}
                Save Changes
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditBook;