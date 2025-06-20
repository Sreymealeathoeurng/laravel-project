import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  FaArrowLeft, FaClipboardCheck, FaMinus, FaPlus, 
  FaClipboardList, FaStickyNote, FaSave, FaCheck,
  FaBook, FaHistory, FaTimes, FaArrowRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Book/styling/textEditor.scss';

const fonts = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = fonts;
ReactQuill.Quill.register(Font, true);

const StoryBookEditor = ({ onSave }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const bookIdFromQuery = queryParams.get('bookId');

  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isNextChapterVisible, setIsNextChapterVisible] = useState(false);
  const [isPublishReady, setIsPublishReady] = useState(false);

  const [chapterData, setChapterData] = useState({
    title: '',
    content: '',
    status: 'draft',
    pov: 'First Person',
    mood: '',
    summary: '',
    notes: '',
    ...(location.state?.chapter || {}),
    bookId: location.state?.chapter?.bookId || bookIdFromQuery || '',
  });

  useEffect(() => {
    if (chapterData.content) {
      const text = chapterData.content.replace(/<[^>]*>/g, ' ').trim(); // Remove HTML tags
      const words = text ? text.split(/\s+/).length : 0;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [chapterData.content]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapterData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setChapterData(prev => ({ ...prev, content }));
  };

  const handleSave = async (isFinal) => {
    setIsSaving(true);
    const dataToSave = {
      ...chapterData,
      status: isFinal ? 'final' : chapterData.status,
      last_saved: moment().format('YYYY-MM-DD HH:mm:ss'),
      book_id: chapterData.bookId,
    };

    if (!dataToSave.book_id) {
      showNotification('error', 'Book ID missing!');
      setIsSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'Authentication required!');
        setIsSaving(false);
        return;
      }

      const existingStory = await axios.get(`http://localhost:8000/api/stories`, {
        params: {
          book_id: dataToSave.book_id,
          title: dataToSave.title,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let savedData;

      if (existingStory.data?.id) {
        const response = await axios.put(
          `http://localhost:8000/api/stories/${existingStory.data.id}`,
          dataToSave,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        savedData = response.data;
      } else {
        const response = await axios.post(
          `http://localhost:8000/api/stories`,
          dataToSave,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        savedData = response.data;
      }

      if (onSave) onSave(savedData);

      if (isFinal) {
        showNotification('success-complete', 'Chapter completed successfully!');
        setIsNextChapterVisible(true);
        setIsPublishReady(true);
      } else {
        showNotification('success-draft', 'Draft saved successfully!');
      }
    } catch (error) {
      showNotification(
        'error',
        `Save failed: ${error.response?.data?.message || 'Unknown error'}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNextChapter = () => {
    setChapterData({
      title: '',
      content: '',
      status: 'draft',
      pov: 'First Person',
      mood: '',
      summary: '',
      notes: '',
      bookId: chapterData.bookId
    });
    setIsNextChapterVisible(false);
    showNotification('success-draft', 'Ready to create next chapter!');
  };

  const handlePublishBook = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:8000/api/books/${chapterData.bookId}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      showNotification('success-complete', 'Book published!');
      navigate(`/books/${chapterData.bookId}/preview`);
    } catch (error) {
      showNotification(
        'error',
        `Publishing failed: ${error.response?.data?.message || 'Unknown error'}`
      );
    }
  };

  return (
    <motion.div className="story-editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="notification-content">
              {notification.type === 'success-draft' && <FaSave className="notification-icon" />}
              {notification.type === 'success-complete' && <FaCheck className="notification-icon" />}
              {notification.type === 'error' && <div className="notification-error-icon">!</div>}
              <span>{notification.message}</span>
            </div>
            <button className="notification-close" onClick={() => setNotification(null)}>
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="editor-header">
        <div className="header-left">
          <motion.button onClick={() => navigate('/create-story')} className="back-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FaArrowLeft /> Back
          </motion.button>
          <div className="chapter-title">
            <FaBook className="book-icon" />
            <input
              type="text"
              name="title"
              value={chapterData.title}
              onChange={handleChange}
              placeholder="Chapter Title"
              className="title-input"
            />
          </div>
        </div>
        <div className="header-right">
          <div className="stats-badge">
            <span className="word-count">{wordCount} words</span>
            <span className={`status-tag ${chapterData.status}`}>{chapterData.status}</span>
          </div>
        </div>
      </header>

      {/* Editor */}
      <div className="editor-container">
        <div className="writing-area">
          <ReactQuill
            theme="snow"
            value={chapterData.content}
            onChange={handleEditorChange}
            modules={{
              toolbar: [
                [{ font: fonts }, { size: [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ header: [1, 2, 3, false] }],
                [{ align: [] }],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            placeholder="Begin your masterpiece here..."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="editor-footer">
        <div className="footer-left">
          <button className="history-btn">
            <FaHistory /> Version History
          </button>
        </div>

        <div className="footer-right">
          {isNextChapterVisible && (
            <motion.button
              className="next-chapter-btn"
              onClick={handleCreateNextChapter}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <FaArrowRight /> Next Chapter
            </motion.button>
          )}

          <motion.button
            className="save-btn draft"
            onClick={() => handleSave(false)}
            whileHover={{ scale: 1.03 }}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            ) : (
              <>
                <FaSave /> Save Draft
              </>
            )}
          </motion.button>

          <motion.button
            className="save-btn final"
            onClick={() => handleSave(true)}
            whileHover={{ scale: 1.03 }}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            ) : (
              <>
                <FaCheck /> Complete Chapter
              </>
            )}
          </motion.button>

          {isPublishReady && (
            <motion.button className="publish-btn" onClick={handlePublishBook} whileHover={{ scale: 1.05 }}>
              <FaClipboardCheck /> Publish Book
            </motion.button>
          )}
        </div>
      </footer>
    </motion.div>
  );
};

export default StoryBookEditor;