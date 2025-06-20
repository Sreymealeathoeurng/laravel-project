import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LibraryBook = ({ title, cover, progress, onClick }) => (
  <div className="library-book" onClick={onClick}>
    <div className="book-cover-container">
      <img src={cover || '/default-book.jpg'} alt={title} className="book-cover" />
      {progress > 0 && <div className="progress-indicator">{progress}%</div>}
    </div>
    <div className="book-details">
      <h5 className="book-title">{title}</h5>
      <div className="progress-bar">
        <div
          className={`progress ${progress === 100 ? 'completed' : ''}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="progress-text">
        {progress === 100 ? 'Completed' : `${progress}% read`}
      </p>
    </div>
  </div>
);

const LibraryContent = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState({ reading: [], favorites: [], saved: [] });

  useEffect(() => {
    const fetchLibrary = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/library', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allBooks = response.data;
        const reading = allBooks.filter(book => book.pivot.status === 'reading');
        const favorites = allBooks.filter(book => book.pivot.status === 'favorite');
        const saved = allBooks.filter(book => book.pivot.status === 'saved');
        setBooks({ reading, favorites, saved });

      } catch (error) {
        console.error('Error fetching library:', error);
      }
    };

    fetchLibrary();
  }, []);

  const allBooks = [...books.reading, ...books.favorites, ...books.saved];

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const closeBookDetail = () => {
    setSelectedBook(null);
  };

  const getCurrentBooks = () => {
    if (activeCategory === 'all') return allBooks;
    return books[activeCategory] || [];
  };

  return (
    <div className="library-app">
      <div className="content-header">
        <div className="header-left">
          <h1>My Library</h1>
          <p>{allBooks.length} books in your collection</p>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <i className="bx bx-search"></i>
            <input type="text" placeholder="Search books..." />
          </div>
        </div>
      </div>

      <div className="category-nav">
        {['all', 'reading', 'favorites', 'saved'].map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            <i className={`bx bx-${cat === 'all' ? 'library' : cat === 'reading' ? 'book-bookmark' : cat}`}></i>
            {cat === 'all' ? 'All Books' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="library-grid">
        {getCurrentBooks().map((book) => (
          <LibraryBook
            key={book.id}
            title={book.title}
            cover={book.cover_image || '/default-book.jpg'}
            progress={book.pivot.progress || 0}
            onClick={() => handleBookClick(book)}
          />
        ))}
      </div>

      {selectedBook && (
        <div className="book-detail-modal">
          <div className="modal-backdrop" onClick={closeBookDetail}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={closeBookDetail}>
              <i className="bx bx-x"></i>
            </button>
            <div className="modal-body">
              <div className="book-cover-large">
                <img
                  src={selectedBook.cover_image || '/default-book.jpg'}
                  alt={selectedBook.title}
                />
              </div>
              <div className="book-info">
                <h2>{selectedBook.title}</h2>
                <div className="book-meta">
                  <span>{selectedBook.genre || 'Fiction'}</span>
                  <span>356 pages</span>
                  <span>Published 2023</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className={`progress ${selectedBook.pivot.progress === 100 ? 'completed' : ''}`}
                      style={{ width: `${selectedBook.pivot.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {selectedBook.pivot.progress === 100
                      ? 'Completed'
                      : `${selectedBook.pivot.progress || 0}% read`}
                  </p>
                </div>
                <p className="book-description">
                  {selectedBook.description || 'A captivating story...'}
                </p>
                <div className="book-actions">
                  <button className="btn-primary">
                    {selectedBook.pivot.progress === 0 ? 'Start Reading' : 'Continue Reading'}
                  </button>
                  <button className="btn-secondary">
                    <i className="bx bx-bookmark"></i> Save for Later
                  </button>
                  <button className="btn-icon">
                    <i className="bx bx-star"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryContent;
