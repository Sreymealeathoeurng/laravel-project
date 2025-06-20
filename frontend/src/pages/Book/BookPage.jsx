import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaArrowLeft, FaEdit, FaShare,
  FaCheckCircle, FaRegClock, FaGlobe, FaLock, FaBookOpen, FaTrash
} from 'react-icons/fa';
import './styling/BookPage.scss';

function BookPage() {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publicStatus, setPublicStatus] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch book details
  const fetchBook = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/books/${id}/chapters`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      setBookData(response.data);
      setPublicStatus(response.data.isPublic);
      setError(null);
    } catch (err) {
      setError(err.response?.data.message || 'Failed to load book.');
      setBookData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  // Function to create a new story
  const createStory = async (storyData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/stories', storyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Story created successfully!');
      fetchBook(); // Refresh the book data
    } catch (err) {
      setError(err.response?.data.message || 'Failed to create story.');
    }
  };

  // Function to update an existing story
  const updateStory = async (storyId, storyData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8000/api/stories/${storyId}`, storyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Story updated successfully!');
      fetchBook(); // Refresh the book data
    } catch (err) {
      setError(err.response?.data.message || 'Failed to update story.');
    }
  };

  // Function to delete a story
  const deleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/stories/${storyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Story deleted successfully!');
      fetchBook(); // Refresh the book data
    } catch (err) {
      setError(err.response?.data.message || 'Failed to delete story.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cover_image', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:8000/api/books/${id}/upload-cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setBookData(prev => ({ ...prev, coverImage: response.data.coverImage }));
      setError(null);
    } catch (err) {
      setError(err.response?.data.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      setIsPublishing(true);
      const token = localStorage.getItem('token');
      const newStatus = !publicStatus;
      await axios.patch(`http://localhost:8000/api/books/${id}/publish`, { isPublic: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPublicStatus(newStatus);
      setError(null);
    } catch (err) {
      setError(err.response?.data.message || 'Failed to update publish status.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCreateChapter = () => {
    navigate(`/text-editor?bookId=${id}`);
  };

  const handleEditChapter = (chapterId) => {
    navigate(`/text-editor?bookId=${id}&chapterId=${chapterId}`);
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/chapters/${chapterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh chapter list after deletion
      setBookData(prev => ({
        ...prev,
        chapters: prev.chapters.filter(ch => ch.id !== chapterId)
      }));
    } catch (err) {
      setError(err.response?.data.message || "Failed to delete chapter.");
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading book...</p></div>;
  if (error) return <div className="error">{error}</div>;
  if (!bookData) return <div className="no-data">Book not found</div>;

  const completedChapters = bookData.chapters?.filter(ch => ch.status === 'final') || [];
  const currentChapter = completedChapters[activeChapter];

  return (
    <motion.div className="book-page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.button className="back-button" onClick={() => navigate('/profile')} whileHover={{ scale: 1.05 }}>
        <FaArrowLeft /> Back to Library
      </motion.button>

      {successMessage && <div className="success-alert">{successMessage}</div>}

      <div className="book-header">
        <motion.div className="book-cover" whileHover={{ scale: 1.02 }}>
        <img
            src={bookData.coverImage || '/default-book-cover.jpg'}
            alt="Book cover"
            className="cover-img"
          />

          {bookData.isOwner && (
            <div className="upload-container">
              <label htmlFor="cover-upload-input" className="upload-label" style={{ cursor: 'pointer' }}>
                Change Cover
              </label>
              <input
                id="cover-upload-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
              {uploading && <div className="spinner small"></div>}
            </div>
          )}
          <div className="book-status">
            <span className={`status-tag ${bookData.status?.toLowerCase() || 'unknown'}`}>
              {bookData.status || 'Unknown Status'}
            </span>
            <span className={`public-tag ${publicStatus ? 'public' : 'private'}`}>
              {publicStatus ? <FaGlobe /> : <FaLock />} {publicStatus ? 'Public' : 'Private'}
            </span>
          </div>
        </motion.div>

        <div className="book-meta">
          <h1>{bookData.title}</h1>
          <p className="author">By {bookData.authorName || 'Unknown Author'}</p>

          <div className="book-stats">
            <div className="stat-item"><FaBookOpen /> <span>{completedChapters.length} Chapters</span></div>
            <div className="stat-item"><FaRegClock /> <span>{Math.ceil(completedChapters.reduce((acc, ch) => acc + (ch.readingTime || 5), 0) / 60)}h Read</span></div>
          </div>

          <p className="description">{bookData.description}</p>

          <div className="book-tags">
            <span className="genre-tag">{bookData.genre}</span>
            {bookData.language && <span className="language-tag">{bookData.language}</span>}
          </div>

          <div className="book-actions">
            <motion.button className="action-btn" whileHover={{ scale: 1.05 }}>
              <FaShare /> Share
            </motion.button>
            {bookData.isOwner && (
              <motion.button
                className={`publish-btn ${publicStatus ? 'published' : 'unpublished'}`}
                onClick={handlePublishToggle}
                disabled={isPublishing}
                whileHover={{ scale: 1.05 }}
              >
                {isPublishing ? <div className="spinner"></div> : publicStatus ? <><FaGlobe /> Published</> : <><FaLock /> Make Public</>}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="chapters-section">
        <h2><FaBookOpen className="section-icon" /> {completedChapters.length > 0 ? 'Chapters' : 'No Chapters Yet'} <span className="chapter-count">{completedChapters.length}</span></h2>

        {completedChapters.length > 0 && (
          <div className="chapters-list">
            {completedChapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                className={`chapter-item ${index === activeChapter ? 'active' : ''}`}
                onClick={() => setActiveChapter(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="chapter-number">Chapter {index + 1}</div>
                <div className="chapter-title">{chapter.title}</div>
                <div className="chapter-meta">
                  <FaRegClock /> {chapter.readingTime || 5} min read <FaCheckCircle className="completed-icon" />
                </div>
                {bookData.isOwner && (
                  <div className="chapter-actions-inline">
                    <button onClick={(e) => { e.stopPropagation(); handleEditChapter(chapter.id); }} className="edit-btn"><FaEdit /> Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter.id); }} className="delete-btn"><FaTrash /> Delete</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {bookData.isOwner && (
          <div className="chapter-controls">
            <motion.button
              className="create-chapter-btn"
              onClick={handleCreateChapter}
              whileHover={{ scale: 1.05 }}
            >
              <FaEdit /> {completedChapters.length === 0 ? 'Create First Chapter' : 'Add New Chapter'}
            </motion.button>
          </div>
        )}
      </div>

      {currentChapter && (
        <motion.div className="chapter-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="chapter-header">
            <h2>{currentChapter.title}</h2>
            <div className="chapter-meta">
              <span><FaRegClock /> {currentChapter.readingTime || 5} min read</span>
              <span>Last updated: {new Date(currentChapter.updatedAt).toLocaleDateString()}</span>
              {currentChapter.authorName && <span>Author: {currentChapter.authorName}</span>}
            </div>
          </div>

          <div className="chapter-text" dangerouslySetInnerHTML={{ __html: currentChapter.content }} />

          <div className="chapter-actions">
            <motion.button
              className="prev-chapter"
              onClick={() => setActiveChapter(prev => Math.max(prev - 1, 0))}
              disabled={activeChapter === 0}
              whileHover={{ scale: 1.05 }}
            >
              ← Previous
            </motion.button>

            <motion.button
              className="next-chapter"
              onClick={() => setActiveChapter(prev => Math.min(prev + 1, completedChapters.length - 1))}
              disabled={activeChapter === completedChapters.length - 1}
              whileHover={{ scale: 1.05 }}
            >
              Next →
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default BookPage;