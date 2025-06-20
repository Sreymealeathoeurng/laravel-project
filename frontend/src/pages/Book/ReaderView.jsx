import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaBookmark,
  FaRegBookmark,
  FaMoon,
  FaSun,
  FaArrowLeft,
  FaShare,
  FaCog,
  FaStar,
  FaRegStar,
  FaList,
  FaBookOpen
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './styling/ReaderView.scss';

// SubmitReview component for submitting ratings and reviews
const SubmitReview = ({ bookingId, serviceId }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');

    await axios.post('/api/reviews', {
      booking_id: bookingId,
      comment,
      rating,
   
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setMessage('✅ Your rating has been submitted!');
    setComment('');
    setRating(5);
  } catch (error) {
    console.error('Review submission failed:', error.response ? error.response.data : error);
  }    setMessage('✅ Your rating has been submitted!');
  navigate('/genres');
};

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4 style={styles.heading}>Submit Your Rating</h4>
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        style={styles.textarea}
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        style={styles.select}
      >
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
        ))}
      </select>
      <button type="submit" style={styles.button}>
        ⭐ Submit Rating
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </form>
  );
};

const styles = {
  form: {
    marginTop: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
    minHeight: '60px',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  select: {
    display: 'block',
    marginBottom: '10px',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#ffca28',
    color: '#000',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  message: {
    marginTop: '10px',
    fontStyle: 'italic',
  }
};

// ReaderView component that shows the book and chapters
const ReaderView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState(null);
  const [stories, setStories] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [showReadingProgress, setShowReadingProgress] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchBookStories = async () => {
      try {
        setLoading(true);
        setError(null);
        const encodedSlug = encodeURIComponent(slug);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`http://localhost:8000/api/books/title/${encodedSlug}/stories`, { headers });

        setBookData(response.data);
        setStories(response.data.chapters || []);
        setActiveStoryIndex(0);
        setIsBookmarked(Math.random() > 0.5); // Example bookmarking logic
        setUserRating(Math.floor(Math.random() * 5) + 1); // Example rating logic
      } catch (err) {
        console.error("Error fetching book stories:", err);
        setError(err.response?.data?.message || 'Failed to load book content.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookStories();
  }, [slug]);

  const currentStory = stories[activeStoryIndex] || {};

  const handleBack = () => {
    navigate('/genres');
  };

  const handleNextStory = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleChapterSelect = (index) => {
    setActiveStoryIndex(index);
    setShowChapters(false);
    window.scrollTo(0, 0);
  };

  const getReadingTime = (text = '') => {
    const wordsPerMinute = 200;
    return Math.ceil(text.split(' ').length / wordsPerMinute);
  };

  const toggleReadingProgress = () => {
    setShowReadingProgress(!showReadingProgress);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${bookData?.title} - ${currentStory.title}`,
        text: `Read "${currentStory.title}" from ${bookData?.title} on StoryForge`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Loading and Error States
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Content</h3>
        <p>{error}</p>
        <button className="btn-primary" onClick={handleBack}>
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className={`reader-container ${darkMode ? 'dark-mode' : ''}`} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      {/* Floating Progress Indicator */}
      {showReadingProgress && (
        <motion.div 
          className="floating-progress"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(activeStoryIndex + 1) / stories.length * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Chapter {activeStoryIndex + 1} of {stories.length}
          </div>
          <button 
            className="toggle-progress"
            onClick={toggleReadingProgress}
            title={showReadingProgress ? "Hide Progress" : "Show Progress"}
          >
            {showReadingProgress ? "↑" : "↓"}
          </button>
        </motion.div>
      )}

      <motion.header 
        className="reader-header" 
        initial={{ y: -20 }} 
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="header-left">
          <motion.button 
            aria-label="Go back" 
            className="back-button" 
            onClick={handleBack} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> 
          </motion.button>
          
          <div className="story-info">
            <h2>{bookData?.title || 'Untitled Book'}</h2>
            <div className="book-meta">
              <span>by {currentStory.authorName || 'Unknown'}</span>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < userRating ? 'filled' : ''} />
                ))}
                <span>(4.8)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <motion.button 
            className="icon-button" 
            onClick={() => setIsBookmarked(!isBookmarked)} 
            whileTap={{ scale: 0.9 }}
            title={isBookmarked ? "Remove bookmark" : "Bookmark this book"}
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </motion.button>
          
          <motion.button 
            className="icon-button" 
            onClick={() => setShowChapters(true)}
            whileTap={{ scale: 0.9 }}
            title="View chapters"
          >
            <FaList />
          </motion.button>
          
          <motion.button 
            className="icon-button" 
            onClick={() => setShowSettings(!showSettings)} 
            whileTap={{ scale: 0.9 }}
            title="Reading settings"
          >
            <FaCog />
          </motion.button>
        </div>
      </motion.header>

      {/* Chapters Drawer */}
      <AnimatePresence>
        {showChapters && (
          <motion.div 
            className="chapters-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="drawer-header">
              <h3>Chapters</h3>
              <button className="close-drawer" onClick={() => setShowChapters(false)}>
                &times;
              </button>
            </div>
            <div className="chapters-list">
              {stories.map((story, index) => (
                <motion.div
                  key={index}
                  className={`chapter-item ${index === activeStoryIndex ? 'active' : ''}`}
                  onClick={() => handleChapterSelect(index)}
                  whileHover={{ backgroundColor: darkMode ? '#333' : '#f5f5f5' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="chapter-number">{index + 1}</div>
                  <div className="chapter-info">
                    <h4>{story.title || `Chapter ${index + 1}`}</h4>
                    <p>{getReadingTime(story.content)} min read</p>
                  </div>
                  {index === activeStoryIndex && <div className="active-indicator"></div>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="settings-panel" 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="setting-group">
              <label>Font Size</label>
              <div className="font-controls">
                <button 
                  onClick={() => setFontSize(Math.max(14, fontSize - 1))} 
                  disabled={fontSize <= 14}
                >
                  A-
                </button>
                <span>{fontSize}px</span>
                <button 
                  onClick={() => setFontSize(Math.min(22, fontSize + 1))} 
                  disabled={fontSize >= 22}
                >
                  A+
                </button>
              </div>
            </div>

            <div className="setting-group">
              <label>Theme</label>
              <button 
                className="theme-toggle" 
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
                {darkMode ? ' Light Mode' : ' Dark Mode'}
              </button>
            </div>
            
            <div className="setting-group">
              <label>Reading Progress</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="progress-toggle" 
                  checked={showReadingProgress} 
                  onChange={toggleReadingProgress} 
                />
                <label htmlFor="progress-toggle"></label>
                <span>{showReadingProgress ? 'Visible' : 'Hidden'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="reader-content" style={{ fontSize: `${fontSize}px` }}>
        <motion.div
          key={activeStoryIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <article className="episode-content">
            <div className="chapter-header">
              <h1>
                <FaBookOpen className="chapter-icon" />
                {currentStory.title || 'No Story Selected'}
              </h1>
              <div className="chapter-number">
                Chapter {activeStoryIndex + 1}
              </div>
            </div>
            
            <div className="content-meta">
              <span>{currentStory.updatedAt ? new Date(currentStory.updatedAt).toLocaleDateString() : ''}</span>
              <span>•</span>
              <span>{getReadingTime(currentStory.content)} min read</span>
              <span>•</span>
              <span>by {currentStory.authorName || 'Unknown'}</span>
            </div>
            <div className="episode-text">
                  {(currentStory.content || '').split('\n\n').map((paragraph, i) => (
                    <div key={i}>{paragraph}</div>
                  ))}
                </div>

            {/* Show review submission on last chapter */}
            {activeStoryIndex === stories.length - 1 && (
              <>
                <div className="book-completion">
                  <div className="completion-badge">
                    <div className="badge-icon">🏆</div>
                    <h3>Book Completed!</h3>
                    <p>You've finished reading {bookData?.title}</p>
                  </div>
                  <SubmitReview bookingId={bookData?.id} serviceId={currentStory.service_id || 1} />
                </div>
              </>
            )}
          </article>
        </motion.div>
      </main>

      <footer className="reader-footer">
        <div className="footer-actions">
          <motion.button 
            className="share-button"
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShare /> Share
          </motion.button>
          
          <div className="nav-buttons">
            <motion.button 
              className="prev-button" 
              onClick={handlePrevStory} 
              disabled={activeStoryIndex === 0}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Previous
            </motion.button>
            
            <div className="progress-indicator">
              {activeStoryIndex + 1} / {stories.length}
            </div>
            
            <motion.button 
              className="next-button" 
              onClick={handleNextStory} 
              disabled={activeStoryIndex === stories.length - 1}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              Next →
            </motion.button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default ReaderView;