import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaImage, FaTimes, FaCheck, FaArrowLeft, FaSave, FaHistory } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './styling/startWriting.scss';

const BookEditor = () => {
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    category_id: '',
    language: '',
    publicationDate: '',
    coverImage: null,
  });

  const [coverPreview, setCoverPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookData((prev) => ({ ...prev, coverImage: file }));
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bookData.title.trim()) newErrors.title = 'Title is required';
    if (!bookData.description.trim()) newErrors.description = 'Description is required';
    if (!bookData.category_id) newErrors.category_id = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('description', bookData.description);
      formData.append('category_id', bookData.category_id);
      if (bookData.language) formData.append('language', bookData.language);
      if (bookData.publicationDate) formData.append('publicationDate', bookData.publicationDate);
      if (bookData.coverImage) formData.append('coverImage', bookData.coverImage);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token missing. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post('http://localhost:8000/api/books', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate('/text-editor', {
          state: {
            chapter: {
              bookId: response.data.book.id,
              title: 'Chapter 1',
              content: '',
              status: 'draft',
              pov: 'First Person',
              mood: '',
              summary: '',
              notes: '',
            },
          },
        });
      }, 1500);
    } catch (error) {
      alert('Error saving book: ' + (error.response?.data?.message || 'An unknown error occurred.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div className="create-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <AnimatePresence>
        {showSuccess && (
          <motion.div className="success-notification" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} transition={{ duration: 0.3 }}>
            <FaCheck className="success-icon" />
            <span>Book saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="create-book-form-container">
        <motion.div className="form-left" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <div className="left-content">
            <h2>Begin Your Literary Journey</h2>
            <p className="subtitle">Fill in the details below to bring your book to life.</p>
            <p>Writing a book is an exciting adventure! Share your stories, thoughts, and creativity with the world. Whether it's fiction or non-fiction, your words have the power to inspire and entertain.</p>
            <p>Let's get started on your journey as an author!</p>
          </div>
        </motion.div>

        <div className="form-right">
          <AnimatePresence>
            <motion.form onSubmit={handleSubmit} initial="hidden" animate="visible" exit={{ opacity: 0, x: 50 }} key="bookForm">
              <div className="form-header">
                <h3>New Book Details</h3>
              </div>

              {/* Cover Image Upload */}
              <motion.div className="form-group image-upload-group">
                <label htmlFor="coverImage">
                  <FaImage className="input-icon" /> Cover Image (Optional)
                </label>
                <div className="image-upload-container">
                  {coverPreview ? (
                    <motion.div className="image-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <img src={coverPreview} alt="Preview" />
                      <div className="image-actions">
                        <motion.button type="button" onClick={() => document.getElementById('coverImage').click()} whileHover={{ scale: 1.05 }}>
                          Change
                        </motion.button>
                        <motion.button type="button" onClick={() => { setCoverPreview(null); setBookData(prev => ({ ...prev, coverImage: null })); }} whileHover={{ scale: 1.05 }}>
                          <FaTimes />
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.label htmlFor="coverImage" className="upload-placeholder" whileHover={{ scale: 1.02 }}>
                      <FaImage size={40} />
                      <span>Upload Cover Image</span>
                    </motion.label>
                  )}
                  <input type="file" id="coverImage" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </div>
              </motion.div>

              {/* Book Title */}
              <motion.div className="form-group">
                <label htmlFor="title">Book Title <span className="required">*</span></label>
                <input type="text" id="title" name="title" value={bookData.title} onChange={handleChange} className={errors.title ? 'error' : ''} placeholder="Enter your book title" />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </motion.div>

              {/* Description */}
              <motion.div className="form-group">
                <label htmlFor="description">Description <span className="required">*</span></label>
                <textarea id="description" name="description" value={bookData.description} onChange={handleChange} className={errors.description ? 'error' : ''} placeholder="Briefly describe your book" rows="4" />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </motion.div>

              {/* Category */}
              <motion.div className="form-group">
                <label htmlFor="category_id">Category <span className="required">*</span></label>
                <select id="category_id" name="category_id" value={bookData.category_id} onChange={handleChange} className={errors.category_id ? 'error' : ''}>
                  <option value="">Select a category</option>
                  <option value="1">Fantasy</option>
                  <option value="2">Science Fiction</option>
                  <option value="3">Mystery</option>
                  <option value="4">Romance</option>
                  <option value="5">Historical Fiction</option>
                  <option value="6">Thriller</option>
                  <option value="7">Horror</option>
                  <option value="8">Biography</option>
                </select>
                {errors.category_id && <span className="error-message">{errors.category_id}</span>}
              </motion.div>

              {/* Language */}
              <motion.div className="form-group">
                <label htmlFor="language">Language</label>
                <select id="language" name="language" value={bookData.language} onChange={handleChange}>
                  <option value="">Select language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </motion.div>

              {/* Publication Date */}
              <motion.div className="form-group">
                <label htmlFor="publicationDate">Publication Date</label>
                <input type="date" id="publicationDate" name="publicationDate" value={bookData.publicationDate} onChange={handleChange} />
              </motion.div>

              {/* Action Buttons */}
              <motion.div className="form-actions">
                <motion.button type="button" onClick={() => navigate('/create-story')} className="cancel" whileHover={{ scale: 1.05 }}>
                  <FaArrowLeft /> Cancel
                </motion.button>
                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }}>
                  {isSubmitting ? <FaHistory className="spin" /> : <FaSave />}
                  {isSubmitting ? 'Saving...' : 'Save Book'}
                </motion.button>
              </motion.div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default BookEditor;